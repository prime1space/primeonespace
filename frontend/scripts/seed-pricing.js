
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seedPricing() {
    try {
        const existing = await client.execute('SELECT * FROM pricing');
        if (existing.rows.length > 0) {
            console.log('Pricing already seeded');
            return;
        }

        const prices = [
            {
                space_type: 'dedicated_desk',
                hourly_rate: 10,
                daily_rate: 80,
                monthly_rate: 500,
                features: JSON.stringify(["Starlink WiFi", "Power outlets", "Ergonomic chair", "Desk lamp"])
            },
            {
                space_type: 'meeting_room',
                hourly_rate: 25,
                daily_rate: 150,
                monthly_rate: null,
                features: JSON.stringify(["Projector", "Whiteboard", "Video conferencing", "Refreshments"])
            },
            {
                space_type: 'private_office',
                hourly_rate: 40,
                daily_rate: 250,
                monthly_rate: 1800,
                features: JSON.stringify(["Standing desk", "Private entrance", "Storage", "24/7 access"])
            }
        ];

        for (const p of prices) {
            await client.execute({
                sql: `INSERT INTO pricing (space_type, hourly_rate, daily_rate, monthly_rate, features) VALUES (?, ?, ?, ?, ?)`,
                args: [p.space_type, p.hourly_rate, p.daily_rate, p.monthly_rate, p.features]
            });
        }

        console.log('Pricing seeded successfully');
    } catch (e) {
        console.error('Error seeding pricing:', e);
    }
}

seedPricing();


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

const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@primeone.lk';
  console.log('Seeding using admin email:', adminEmail);

  if (!process.env.TURSO_CONNECTION_URL) {
    console.error('Error: TURSO_CONNECTION_URL not found in .env');
    return;
  }

  const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    // Insert admin user
    await client.execute({
      sql: `INSERT OR REPLACE INTO user (id, name, email, email_verified, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['admin-1', 'Admin User', adminEmail, 1, Date.now(), Date.now()]
    });

    await client.execute({
      sql: `INSERT OR REPLACE INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['admin-account-1', adminEmail, 'credential', 'admin-1', adminPassword, Date.now(), Date.now()]
    });

    // Insert regular user
    await client.execute({
      sql: `INSERT OR REPLACE INTO user (id, name, email, email_verified, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['user-1', 'John Doe', 'john@example.com', 1, Date.now(), Date.now()]
    });

    await client.execute({
      sql: `INSERT OR REPLACE INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['user-account-1', 'john@example.com', 'credential', 'user-1', userPassword, Date.now(), Date.now()]
    });

    console.log('Test users created successfully!');
    console.log(`Admin: ${adminEmail} / Admin@123`);
    console.log('User: john@example.com / User@123');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    client.close();
  }
}

seedUsers();
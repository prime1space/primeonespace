
// test-login.js
const fetch = require('node-fetch');

async function testLogin() {
    console.log("Attempting login to http://localhost:8001/auth/sign-in/email...");
    try {
        const response = await fetch('http://localhost:8001/auth/sign-in/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000' // Simulate frontend origin
            },
            body: JSON.stringify({
                email: "prime1@gmail.com",
                password: "Admin@123"
            })
        });

        console.log(`Status Code: ${response.status}`);
        const headers = response.headers.raw();
        console.log("Headers:", headers);

        const text = await response.text();
        console.log("Response Body:", text);

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testLogin();

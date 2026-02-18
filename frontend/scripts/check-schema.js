const { createClient } = require('@libsql/client');

async function checkSchema() {
  const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute("PRAGMA table_info(user)");
    console.log('User table columns:', result.rows);
    
    const accountResult = await client.execute("PRAGMA table_info(account)");
    console.log('Account table columns:', accountResult.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

checkSchema();
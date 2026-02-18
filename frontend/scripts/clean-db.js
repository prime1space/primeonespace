const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
async function cleanDb() {
  await client.execute("DELETE FROM user WHERE email = 'admin@primeone.lk'");
  await client.execute("DELETE FROM account WHERE account_id = 'admin@primeone.lk'");
  console.log('Cleaned up broken admin user');
}
cleanDb();

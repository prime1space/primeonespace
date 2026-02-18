const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
async function listUsers() {
  const rs = await client.execute('SELECT * FROM user');
  console.log('Users:', rs.rows);
  const accts = await client.execute('SELECT * FROM account');
  console.log('Accounts:', accts.rows);
}
listUsers();

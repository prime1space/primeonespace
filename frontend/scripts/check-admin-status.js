const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
async function checkAdmin() {
  try {
    const rs = await client.execute("SELECT * FROM user WHERE email = 'admin@primeone.lk'");
    if (rs.rows.length > 0) {
      console.log('ADMIN_EXISTS');
    } else {
      console.log('ADMIN_MISSING');
    }
  } catch(e) { console.log('ERROR', e); }
}
checkAdmin();

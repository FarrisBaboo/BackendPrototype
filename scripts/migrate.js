require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER || undefined,
    password: process.env.PGPASSWORD || undefined,
    database: process.env.PGDATABASE,
  });
  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '001_init.sql'), 'utf8');
    await client.query(sql);
    console.log('Migration applied');
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();

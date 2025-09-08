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
  await client.connect();

  const file = path.resolve(process.env.PROCESSED_DATA_PATH || 'BackendCode/mock_data/processed_data.json');
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));

  const chunk = 1000;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const values = [];
    const placeholders = [];

    slice.forEach((r, idx) => {
      const p = idx * 8;
      placeholders.push(`($${p+1},$${p+2},$${p+3},$${p+4},$${p+5},$${p+6},$${p+7},$${p+8})`);
      values.push(
        r.created_at,
        r.entry_id,
        r["Temperature"] ?? null,
        r["RH Humidity"] ?? null,
        r["Usable Light Index"] ?? null,
        r["Atmosphere hPa"] ?? null,
        r["Voltage Charge"] ?? null,
        r["was_interpolated"] ?? false
      );
    });

    const sql = `
      INSERT INTO readings
      (created_at, entry_id, temperature, rh_humidity, usable_light_index, atmosphere_hpa, voltage_charge, was_interpolated)
      VALUES ${placeholders.join(',')}
      ON CONFLICT (entry_id) DO NOTHING;
    `;

    await client.query('BEGIN');
    try {
      await client.query(sql, values);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    }

    console.log(`Inserted ${Math.min(i + chunk, rows.length)} / ${rows.length}`);
  }

  console.log('Seed complete');
  await client.end();
})().catch(e => { console.error('Seed error:', e.message); process.exit(1); });

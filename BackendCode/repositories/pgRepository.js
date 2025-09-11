const pool = require('../db/pool');

const FIELD_MAP = [
  { db: 'temperature',        api: 'Temperature' },
  { db: 'rh_humidity',        api: 'RH Humidity' },
  { db: 'usable_light_index', api: 'Usable Light Index' },
  { db: 'atmosphere_hpa',     api: 'Atmosphere hPa' },
  { db: 'voltage_charge',     api: 'Voltage Charge' },
];

function toApiRow(r) {
  const out = {
    created_at: r.created_at,
    entry_id: Number(r.entry_id),
    was_interpolated: r.was_interpolated,
  };
  for (const f of FIELD_MAP) {
    const v = r[f.db];
    out[f.api] = (v === null || v === undefined) ? null : Number(v);
  }
  return out;
}

async function getStreams({ limit = 8000, offset = 0, since } = {}) {
  const params = [];
  let where = '';
  if (since) {
    params.push(since);
    where = `WHERE created_at >= $${params.length}`;
  }
  params.push(limit, offset);

  const sql = `
    SELECT created_at, entry_id, temperature, rh_humidity,
           usable_light_index, atmosphere_hpa, voltage_charge, was_interpolated
    FROM readings
    ${where}
    ORDER BY created_at ASC
    LIMIT $${params.length-1} OFFSET $${params.length};
  `;

  const { rows } = await pool.query(sql, params);
  return rows.map(toApiRow);
}

async function getStreamNames() {
  return FIELD_MAP.map(f => f.api);
}

async function getFilteredStreams(streamNames = []) {
  // Pull rows then project requested fields (keeps existing API shape)
  const all = await getStreams({});
  if (!streamNames || streamNames.length === 0) return all;
  return all.map(r => {
    const out = { created_at: r.created_at, entry_id: r.entry_id };
    for (const name of streamNames) out[name] = r[name] ?? null;
    return out;
  });
}

module.exports = { getStreams, getStreamNames, getFilteredStreams };

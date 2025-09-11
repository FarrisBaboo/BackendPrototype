CREATE TABLE IF NOT EXISTS readings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  entry_id BIGINT UNIQUE NOT NULL,
  temperature NUMERIC,
  rh_humidity NUMERIC,
  usable_light_index NUMERIC,
  atmosphere_hpa NUMERIC,
  voltage_charge NUMERIC,
  was_interpolated BOOLEAN DEFAULT FALSE
);

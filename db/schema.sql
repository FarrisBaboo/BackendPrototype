-- Drop existing tables
DROP TABLE IF EXISTS timeseries_sensordata CASCADE;
DROP TABLE IF EXISTS timeseries_sensorstream CASCADE;
DROP TABLE IF EXISTS timeseries_device CASCADE;
DROP TABLE IF EXISTS timeseries_dataset CASCADE;

CREATE TABLE timeseries_dataset (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timeseries_device (
    id SERIAL PRIMARY KEY,
    dataset_id INTEGER REFERENCES timeseries_dataset(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE timeseries_sensorstream (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES timeseries_device(id) ON DELETE CASCADE,
    stream_type VARCHAR(50) NOT NULL
);

CREATE TABLE timeseries_sensordata (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER REFERENCES timeseries_sensorstream(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value FLOAT NOT NULL
);

-- Enable TimescaleDB extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create hypertable
SELECT create_hypertable('timeseries_sensordata', 'timestamp', chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);

-- Insert sample data
INSERT INTO timeseries_dataset (name) VALUES ('Test Dataset 1');
INSERT INTO timeseries_device (dataset_id, name) VALUES (1, 'Sensor A'), (1, 'Sensor B'), (1, 'Sensor C');
INSERT INTO timeseries_sensorstream (device_id, stream_type) VALUES (1, 'Temperature'), (2, 'Humidity'), (3, 'Pressure');
INSERT INTO timeseries_sensordata (stream_id, timestamp, value) VALUES
    (1, '2025-07-24T00:00:00Z', 22.5),
    (1, '2025-07-24T00:10:00Z', 23.0),
    (2, '2025-07-24T00:00:00Z', 65.0),
    (2, '2025-07-24T00:10:00Z', 66.5),
    (3, '2025-07-24T00:00:00Z', 1013.2),
    (3, '2025-07-24T00:10:00Z', 1012.8);
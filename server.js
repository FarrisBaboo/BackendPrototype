require('dotenv').config();
const express = require('express');
const app = express();

const datasetRoutes = require('./routes/datasetRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const sensorStreamRoutes = require('./routes/sensorStreamRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');

app.use(express.json());

app.use('/api/datasets', datasetRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensorstreams', sensorStreamRoutes);
app.use('/api/sensordata', sensorDataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
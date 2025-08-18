const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const PYTHON_URL = 'http://localhost:5000';

exports.postAnalyze = async (req, res) => {
  try {
    const { streams, start_date, end_date, threshold, algo_type } = req.body;

    // Load your CSV file (adjust path if needed)
    const filePath = path.join(__dirname, '../mock_data/complex.csv');

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('streams', JSON.stringify(streams));
    form.append('start_date', start_date);
    form.append('end_date', end_date);
    form.append('threshold', threshold);
    form.append('algo_type', algo_type);

    const response = await axios.post(`${PYTHON_URL}/analyze`, form, {
      headers: form.getHeaders()
    });

    res.json(response.data);
  } catch (err) {
    console.error('Python service error:', err.message);
    res.status(500).json({ error: 'Failed to connect to Python service' });
  }
};
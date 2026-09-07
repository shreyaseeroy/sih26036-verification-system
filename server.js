require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const instrumentRoutes = require('./routes/instrumentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/instruments', instrumentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/certificates', certificateRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
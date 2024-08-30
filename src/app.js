const express = require('express');
const path = require('path');  
const connectDB = require('./utils/db');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/upload', require('./routes/upload'));
app.use('/api/status', require('./routes/status'));

app.use('/output', express.static(path.join(__dirname, '../output')));

module.exports = app;

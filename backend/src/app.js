const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const customerRoutes = require('./routes/customers');
const dashboardRoute = require('./routes/dashboard');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoute);

module.exports = app;

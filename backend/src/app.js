const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const customerRoutes = require('./routes/customers');
const dashboardRoute = require('./routes/dashboard');
const cors = require('cors');
const app = express();

// Allow requests from your frontend
// app.options('*', cors());
app.use(cors({
  origin: 'http://localhost:3000', // allow only your frontend
  methods: ['GET','POST'],
  credentials: true, // if you use cookies or auth
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoute);

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const customerRoutes = require('./routes/customers');
const dashboardRoute = require('./routes/dashboard');
const cors = require('cors');
const app = express();
const morgan = require("morgan"); // <-- add this


app.use(cors({
  origin: process.env.FRONTEND_URL, // allow only your frontend
  methods: ['GET','POST'],
  credentials: true, // if you use cookies or auth
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined")); 

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoute);

module.exports = app;

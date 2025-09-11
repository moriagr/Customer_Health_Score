const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log("1")
const customerRoutes = require('./routes/customers');
console.log("2")

const app = express();
app.use(bodyParser.json());
console.log("3")

// Routes
app.use('/api/customers', customerRoutes);
console.log("4")

module.exports = app;

console.log("5")
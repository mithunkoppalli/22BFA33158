// app.js
const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const urlRoutes = require('./routes/url');

const app = express();

app.use(express.json());
app.use(logger);
app.use(auth);
app.use('/', urlRoutes);

module.exports = app;

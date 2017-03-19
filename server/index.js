const express = require('express');
const mongoose = require('mongoose');
const { connect } = require('./config');

connect(mongoose, process.env.DATABASE_URL);
const app = express();

app.get('/', (req, res) => {
  return res
    .status(200)
    .json({
      status: 'online',
      ip: req.ip,
      host: req.headers.host,
      message: 'Bootrank is working well'
    });
});

module.exports = app;

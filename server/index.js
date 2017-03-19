const express = require('express');
const mongoose = require('mongoose');
const { connect } = require('./config');

connect(mongoose, process.env.DATABASE_URL);

console.log("mongodb", process.env.DATABASE_URL)
console.log("redis", process.env.REDIS_URL)

// App
const app = express();
app.get('/', function(req, res) {
  res.send('Hello world\n');
});

module.exports = app;

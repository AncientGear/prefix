'use strict'
const express = require('express');
const cors = require('cors');

const app = express();

const prefixRoute = require('./app/routes/prefix');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', prefixRoute);


module.exports = app;
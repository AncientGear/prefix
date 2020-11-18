'use strict'

const express = require('express');
const TriploController = require('../controller/triplo');


const router = express.Router();

router.post('/triplo', TriploController.getTriplo);

module.exports = router;
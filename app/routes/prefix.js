'use strict'

const express = require('express');
const PrefixController = require('../controller/prefix');


const router = express.Router();

router.post('/triplo', PrefixController.getPrefix);

// direccion/triplo

module.exports = router;
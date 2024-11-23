const express = require('express');
const router = express.Router();

const rideRouter = require('./ride.controller');

router.use('/ride', rideRouter);

module.exports = router;


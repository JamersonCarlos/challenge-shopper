import express from 'express';
const router = express.Router();

const rideRouter: NodeRequire = require('./ride.controller');
const driverRouter: NodeRequire = require('./drivers.controller');
const tripRouter: NodeRequire  = require('./trip.controller')

router.use('/ride', rideRouter);
router.use('/drivers', driverRouter);
router.use('/trips', tripRouter);

module.exports = router;


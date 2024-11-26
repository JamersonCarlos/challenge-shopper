import express from 'express';
const router = express.Router();

const rideRouter: NodeRequire = require('./ride.controller');
const driverRouter: NodeRequire = require('./drivers.controller');

router.use('/ride', rideRouter);
router.use('/drivers', driverRouter);

module.exports = router;


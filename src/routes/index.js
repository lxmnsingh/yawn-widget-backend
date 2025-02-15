const express = require('express');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const router = express.Router();
const ctrl = require('../controllers/IndexController');

// use the routes
router.use('/user', userRoutes);
router.use('/order', orderRoutes);

router.get('/cmc', ctrl.getAssetLatestDataCMC);
router.get('/forex', ctrl.getForexRates);
router.get('/token', ctrl.getTokenInfo);

module.exports = router;
const express = require('express');
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/OrderController');
const {validateOrderCreation} = require('../middlewares/validators');
const router = express.Router();

router.post('/', validateOrderCreation, auth,  ctrl.saveOrder);
router.get('/users', auth, ctrl.getUserOrders);
//router.get('/order/:order_id', auth, getOrder);

module.exports = router;
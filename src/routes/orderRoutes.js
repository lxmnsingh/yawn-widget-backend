const express = require('express');
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/OrderController');
const {validateOrderCreation, validateSendTransactionReceipt} = require('../middlewares/validators');
const router = express.Router();

router.post('/', validateOrderCreation, ctrl.saveOrder);
router.get('/user/:userId', ctrl.getUserOrders);
router.get('/:order_id', ctrl.getOrderById);
router.post('/send-tx-receipt', validateSendTransactionReceipt, ctrl.sendTransactionReceipt);
//router.get('/order/:order_id', auth, getOrder);

module.exports = router;
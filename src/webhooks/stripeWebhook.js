// src/webhooks/wertWebhooks.js
const { InternalServerError, isHttpError } = require('http-errors');
const orderService = require('../services/orderService');
const logger = require('../utils/logger');
const { executeQuote } = require('../services/lifiService');
//const pusher = require('../services/pusherService');
const orderStatuses = {
    succeeded: "completed"
}

const handleStripeWebhook = async (req, res, next) => {
    const paymentIntent = req.body;
    const { orderId } = req.params;

    // Only handle requests that have orderId
    if (!orderId) {
        logger.warn(`Missing orderId`);
        return res.status(400).json({ message: 'Missing orderId' });
    }

    if (!paymentIntent) {
        logger.warn(`Missing paymentIntent for the orderId ${orderId}`);
        return res.status(400).json({ message: 'Missing paymentIntent' });
    }
    let orderData = {
        stripePaymentId: paymentIntent?.id,
        stripePayment: paymentIntent,
    }

    try {
        // Respond with success
        logger.info(`Initiated processing webhook for the orderId ${orderId}`);
        let order = await orderService.saveOrder(orderData, orderId);
        if (order && !order?.crypto?.txHash) {
            console.log("Ethereum Transaction Initiated...");
            const tx = await executeQuote(order);
            console.log("Ethereum Transaction Completed:", tx);

            orderData = {
                networkFee: tx?.networkFee,
                'toToken.tokenAmount': tx?.toTokenAmount,
                'fromToken.tokenAmount': tx?.fromTokenAmount,
                'crypto.txHash': tx?.txHash,
                fee: tx?.fee,
                status: orderStatuses[paymentIntent?.status]
            };

            order = await orderService.saveOrder(orderData, orderId);

            const result = {
                _id: orderId,
                click_id: order.click_id,
                status: order.status,
                txHash: order?.crypto?.txHash,
                toAmount: order?.toToken?.tokenAmount,
                redirectUrl: `${process.env.CLIENT_URL}/success/${orderId}`,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
            res.status(200).json({ message: 'Webhook updated successfully', order: result });
        } else {
            logger.warn(`No order found for the orderId ${orderId}`);
            return res.status(404).json({ message: 'No order found' });
        }

    } catch (error) {
        logger.error(`Error processing webhook for the orderId ${orderId} - ${error.message}`);
        console.error(error);
        next(isHttpError(error) ? error : new InternalServerError('Something Went Wrong'));
    }
};
module.exports = handleStripeWebhook;

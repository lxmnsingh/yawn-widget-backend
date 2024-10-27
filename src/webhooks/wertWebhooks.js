// src/webhooks/wertWebhooks.js
const { InternalServerError, isHttpError } = require('http-errors');
const clickService = require("../services/clickService");
const orderService = require('../services/orderService');

const handleWertWebhooks = async (req, res, next) => {
    const event = req.body;
    const { type, click_id, order } = event;

    // Only handle events that have order data
    if (!order) {
        return res.status(200).json({ message: 'Non-order event received', event });
    }

    try {
        const { userId } = await clickService.getClick(click_id);

        // Set order status based on event type
        const status = {
            "order_complete": "success",
            "order_failed": "failed",
            "tx_smart_contract_failed": "failed",
            "order_canceled": "canceled"
        }[type] || "pending";  // Default to "pending" for unrecognized types

        // Prepare order data and save
        const orderData = {
            order_id: order.id,
            status,
            tx_id: order.transaction_id
        };
        const savedOrder = await orderService.saveOrder(orderData, userId);

        // Respond with success
        res.status(200).json({ message: 'Order-related webhook received', event, order: savedOrder });

    } catch (error) {
        console.error(error);
        next(isHttpError(error) ? error : new InternalServerError('Something Went Wrong'));
    }
};

module.exports = handleWertWebhooks;

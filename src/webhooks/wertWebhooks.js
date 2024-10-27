// src/webhooks/wertWebhooks.js
const { InternalServerError, isHttpError } = require('http-errors');
const clickService = require("../services/clickService");
const orderService = require('../services/orderService');
const logger = require('../utils/logger');
const pusher = require('../services/pusherService');

const handleWertWebhooks = async (req, res, next) => {
    const event = req.body;
    const { type, click_id, order } = event;

    // Only handle events that have order data
    if (!order) {
        logger.warn(`No-order event received for the click ID ${click_id}`);
        return res.status(200).json({ message: 'Non-order event received', event });
    }

    try {
        const click = await clickService.getClick(click_id);
        if (!click) {
            logger.warn(`No userID found for the click ID ${click_id}, returning 404.`);
            return res.status(404).json({ message: `Click ID ${click_id} not found`, event });
        }

        const { userId } = click;

        // Log the incoming event attempt
        logger.info(`Received event ${event.type} for click_id: ${click_id}`);
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

        let newOrder = await orderService.getOrderById(order.id);
        if(newOrder?.wert_order?.status != "success"){
            newOrder = await orderService.saveOrder(orderData, userId);
        }

        if(newOrder) await pusher.trigger('wert-webhook', "order-status", newOrder.wert_order);
        // Respond with success
        res.status(200).json({ message: 'Order-related webhook received', event, order: newOrder });

    } catch (error) {
        logger.error(`Error processing webhook for event ${event.type} - ${error.message}`);
        next(isHttpError(error) ? error : new InternalServerError('Something Went Wrong'));
    }
};

module.exports = handleWertWebhooks;

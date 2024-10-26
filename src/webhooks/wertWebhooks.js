// src/webhooks/wertWebhooks.js
const { InternalServerError, isHttpError } = require('http-errors');
const clickService = require("../services/clickService");
const orderService = require('../services/orderService');

const handleWertWebhooks = async (req, res, next) => {
    const event = req.body;
    let status = "pending";

    try {
        if(event.type==="order_complete"){
            status = "success";
        }else if(event.type==="order_failed"){
            status = "failed";
        }else if(event.type==="order_canceled"){
            status = "canceled";
        }else if(event.type==="tx_smart_contract_failed"){
            status = "failed";
        }else {
            status = "pending";
        }
        const click_id = event.click_id;
        const { userId } = await clickService.getClick(click_id);
        const orderData = {
            order_id: event.order?.id,
            status: status,
            tx_id: event.order?.transaction_id
        };
        const order = await orderService.saveOrder(orderData, userId);
        res.status(200).json({ message: 'Webhook received', event, order });
    } catch (error) {
        console.log(error);
        if (isHttpError(error)) next(error);
        else next(new InternalServerError('Something Went Wrong'));
    }
};

module.exports = handleWertWebhooks;
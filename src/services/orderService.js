const {NotFound} = require('http-errors');
//const wertService = require('./wertService');
const orderRepository = require('../repositories/orderRepository');
const logger = require('../utils/logger');
//const web3 = require('../helpers/web3');

const orderService = {
    saveOrder: async (orderData, id) => {
        try {
            
            /* //Fetch order from Wert by order ID
            const order = await wertService.getOrder({ "search_by": orderData.order_id });
            console.log("Full order data:", order);

            //let mergedOrder = { ...(order || {}), ...orderData };
            if(mergedOrder.tx_id) {
                const onChainData = await web3.getTransactionDetails(mergedOrder.tx_id);
                console.log("onchain data",onChainData);
                mergedOrder = {...mergedOrder, ...onChainData};
            }
            const finalOrderData = {
                order_id: orderData.order_id,
                userId: userId, // user id from the database
                wert_order: mergedOrder
            };*/

            //logger.info(`Successfully saved order ${orderData.order_id} in the database.`);
            // Update the order in your repository
            return await orderRepository.updateOrder(orderData, id);
        } catch (error) {
            console.error(error);
            logger.error(`Error saving order ${id}`);
            throw error;
        }     
    },    

    getUserOrders: async (userId) => {
        return await orderRepository.getOrdersByUser(userId);
    },

    getOrderById: async (order_id) => {
        return await orderRepository.getOrderById(order_id);
    }
};

module.exports = orderService;
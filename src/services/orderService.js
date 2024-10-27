const {NotFound} = require('http-errors');
const wertService = require('./wertService');
const orderRepository = require('../repositories/orderRepository');
const logger = require('../utils/logger');

const orderService = {
    saveOrder: async (orderData, userId) => {
        try {
            // Fetch order from Wert by order ID
            const order = await wertService.getOrder({ "search_by": orderData.order_id });
            console.log("Full order data:", order);
    
            /*if (!order) {
                // Log the missing order and exit without throwing
                logger.warn(`Order with ID ${orderData.order_id} not found in Wert system.`);
                return { message: 'Order not found, skipping update.' };
            }*/

            const mergedOrder = { ...(order || {}), ...orderData };
            
            const finalOrderData = {
                order_id: orderData.order_id,
                userId: userId, // user id from the database
                wert_order: mergedOrder
            };

            logger.info(`Successfully saved order ${orderData.order_id} in the database.`);
            // Update the order in your repository
            return await orderRepository.updateOrder(finalOrderData, orderData.order_id);
        } catch (error) {
            console.error(error);
            logger.error(`Error fetching order ${orderData.order_id} from the Wert.`);
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
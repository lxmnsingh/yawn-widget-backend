const {NotFound} = require('http-errors');
const wertService = require('./wertService');
const orderRepository = require('../repositories/orderRepository');

const orderService = {
    saveOrder: async (orderData, userId) => {
        try {
            // fetch order from Wert by order id
            const order = await wertService.getOrder({ "search_by": orderData.order_id });
            console.log("Full order data:", order);
            if(!order) throw new NotFound('No order found');
            
            const finalOrderData = {
                order_id: orderData.order_id,
                userId: userId, // user id from the dataabse
                wert_order: { ...order, tx_id: orderData.tx_id, status: orderData.status }
            };
            
            return await orderRepository.updateOrder(finalOrderData, orderData.order_id);
        } catch (error) {
            console.error("Error fetching order from Wert:", error);
            throw error;
        }     
    },

    getUserOrders: async (userId) => {
        return await orderRepository.getOrdersByUser(userId);
    }
};

module.exports = orderService;
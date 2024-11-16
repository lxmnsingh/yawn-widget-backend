const Order = require('../models/Order');

const orderRepository = {
    // update an order
    updateOrder: async (data, click_id) => {
        return await Order.findOneAndUpdate({ click_id: click_id }, data, { new: true, upsert: true});
    },

    // get order by ID
    getOrderById: async (order_id) => {
        return await Order.findOne({ _id: order_id });
    },

    // get all orders for a user
    getOrdersByUser: async (userId) => {
        return await Order.find({ userId: userId }).sort({ _id: -1 }).limit(5); // Latest 5 records
    },
};

module.exports = orderRepository;
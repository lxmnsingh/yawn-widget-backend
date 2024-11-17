const Order = require('../models/Order');
const mongoose = require('mongoose');

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

const orderRepository = {
    // update an order

    updateOrder: async (data, id) => {
        try {
            const query = isValidObjectId(id)
                ? { _id: id } // If the id is a valid ObjectId, use it to query `_id`
                : { click_id: id }; // Otherwise, fallback to `click_id`

            return await Order.findOneAndUpdate(query, data, {
                new: true, // Return the updated document
                upsert: true, // Create a new document if none matches
            });
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    // get order by ID
    getOrderById: async (order_id) => {
        const query = isValidObjectId(order_id)
            ? { _id: order_id } // If the id is a valid ObjectId, use it to query `_id`
            : { click_id: order_id }; // Otherwise, fallback to `click_id`
        return await Order.findOne(query);
    },

    // get all orders for a user
    getOrdersByUser: async (userId) => {
        return await Order.find({ userId: userId }).sort({ _id: -1 }).limit(5); // Latest 5 records
    },
};

module.exports = orderRepository;
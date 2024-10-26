const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    order_id: {type: String, unique: true, required: true}, // Wert Order ID
    userId: Schema.Types.ObjectId,
    wert_order: Object
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
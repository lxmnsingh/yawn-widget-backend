const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clickSchema = new mongoose.Schema({
    click_id: {type: String, unique: true, required: true}, // Wert Click ID
    userId: Schema.ObjectId,
},{timestamps: true});

module.exports = mongoose.model('Click', clickSchema);
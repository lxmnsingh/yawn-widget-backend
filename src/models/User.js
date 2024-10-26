const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    verifierId: {type: String, unique: true, required: true}, // Web3Auth VerifierId
    email: String,
    name: String,
    phone: String,
    wert_user_id: String   // Wert User_id
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
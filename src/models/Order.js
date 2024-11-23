const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // User details
        userId: {
            type: String,
            required: true,
            index: true
        },

        userInfo: {
            type: Object,
        },

        click_id: {
            type: String,
            required: true,
        },

        // Token details
        fromToken: {
            tokenAddress: { type: String, required: true }, // Token contract address
            walletAddress: { type: String, required: true }, // Wallet sending tokens
            tokenAmount: { type: String, required: true }, // Amount of tokens being sent
            chainId: { type: Number, required: true }, // Source chain ID
            tokenSymbol: { type: String, required: true },
        },
        toToken: {
            tokenAddress: { type: String, required: true }, // Token contract address
            walletAddress: { type: String, required: true }, // Wallet receiving tokens
            tokenAmount: { type: String, required: true }, // Amount of tokens being received
            chainId: { type: Number, required: true }, // Destination chain ID
            tokenSymbol: { type: String, required: true },
        },

        // Payment details
        amount: {
            type: Number, // Total payment in USD
            required: true
        },
        fee: {
            type: Number, // Total fee in USD
            required: true
        },
        platformFee: {
            type: Number, // Total platform fee in USD
        },
        networkFee: {
            type: Number, // Total network fee in USD
        },
        currency: {
            type: String,
            required: true,
        },
        rate: {
            type: Number, // Total network fee in USD
        },
        paymentMethod: {
            type: String,
            enum: ['yawn', 'metamask', 'walletconnect', 'stripe'],
            required: true,
        },
        stripePaymentId: {
            type: String, // Only for Credit Card payments
        },
        stripePayment: {
            type: Object,
        },
        crypto: {
            txHash: { type: String }, // Only for Crypto payments
            blockchain: { type: String }, // E.g., Ethereum, BNB Chain
            network: { type: String }, // E.g., sepolia, mainnet
        },

        // Order status
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        errorReason: {
            type: String, // Reason for failure, if applicable
        },
        pixelClickId: {
            type: String,
        },
        txReceipt: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Order', orderSchema);

// src/helpers/web3Service.js

const axios = require('axios');
const { ethers } = require('ethers');

async function getTransactionDetails(txHash) {

    const url = `${process.env.ETHERSCAN_API_BASE_URL}?module=account&action=tokentx&txhash=${txHash}&contractaddress=${process.env.CONTRACT_ADDRESS}&apikey=${process.env.ETHERSCAN_API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log("Etherscan Response:", response.data); // Debug: log API response

        if (response.data.status === "0" || response.data.result.length === 0) {
            console.log(`No transaction found for the txHash: ${txHash}`);
            return {};
        }

        // Check first result in case of multiple transfers in the transaction
        const txData = findTransactionByHash(response.data, txHash);
        console.log("Transaction data:", txData); // Debug: log transaction data

        // Convert the token amount from wei to the appropriate format
        const tokenAmount = ethers.formatUnits(txData.value, Number(txData.tokenDecimal))

        return {
            token_symbol: txData.tokenSymbol,
            token_amount: tokenAmount
        };
    } catch (err) {
        console.error("Error Fetching Token Details:", err); // Debug: log error details
        return {};
    }
}

function findTransactionByHash(data, hash) {
    if (data.status === "1" && Array.isArray(data.result)) {
        const transaction = data.result.find(tx => tx.hash === hash);
        return transaction ? transaction : null;
    } else {
        return null;
    }
}

module.exports = {
    getTransactionDetails
};

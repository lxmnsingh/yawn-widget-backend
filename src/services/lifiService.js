const axios = require('axios');
const NodeCache = require('node-cache');
const { ethers } = require("ethers");
const crypto = require('crypto');
const { getExchangeRate } = require('./forexService');

const PRIVATE_KEY = process.env.PRIVATE_KEY; // Replace with your private key
const INFURA_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`; // Replace with your Infura/Alchemy RPC URL
const provider = new ethers.JsonRpcProvider(INFURA_URL); // Connect to Ethereum mainnet
const wallet = new ethers.Wallet(PRIVATE_KEY, provider); // Create a wallet instance using the private key

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 }); // Initialize cache with a TTL of 24 hours (86400 seconds)
const BASE_URL = "https://li.quest/v1";

// Fetch rate data and update cache
async function fetchTokenInformation(chain, token) {
  const API_URL = `${BASE_URL}/token?chain=${chain}&token=${token}`;
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    console.log('Token information fetched:', data);
    cache.set(`token-${chain}-${token}`, data); // Store token
  } catch (error) {
    console.log(error);
    console.error('Error fetching token information:', error.message);
  }
}

// Get token data from cache, refreshing if not present
async function getTokenInformation(chain, token) {
  const cachedToken = cache.get(`token-${chain}-${token}`);
  console.log("cached token information:", cachedToken);
  if (cachedToken) {
    return cachedToken; // Return cached token information if available
  }
  await fetchTokenInformation(chain, token); // Fetch and cache if not present
  return cache.get(`token-${chain}-${token}`); // Return newly cached data
}

async function getQuote(params) {
  console.log("Initiated fetching Quote for...", params);
  try {
    const response = await axios.get(`${BASE_URL}/quote`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw new Error('Failed to fetch routes. Please try again.');
  }

}

async function calculateTotalGasCost(gasCosts) {
  return gasCosts.reduce((total, item) => {
    // Ensure amountUSD is treated as a number
    const amountUSD = parseFloat(item.amountUSD) || 0;
    return total + amountUSD;
  }, 0); // Start with an initial total of 0
}

function generateRandomTransactionHash() {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

async function toBigNumberETH(amount) {
  if (!amount) return;
  const scaledAmount = Math.round(amount * 1e18); // Convert to integer
  return scaledAmount.toString();
}

async function convertAmountToToken(chain, token, amount, forexRates, currency) {
  const rates = await getTokenInformation(chain, token);

  const usdTokenRate = rates.priceUSD || 0;
  const conversionRate = forexRates[currency] || 1;
  const price = usdTokenRate * conversionRate; // in selected fiat price
  if (price) {
    const fromAmount = amount / price;
    return toBigNumberETH(fromAmount);
  }
  return;
}

async function executeQuote(order) {
  try {
    const forexRates = await getExchangeRate();
    const fromTokenAmount = await convertAmountToToken(order.fromToken.chainId, order.fromToken.tokenAddress, order.amount, forexRates, order.currency);
    const params = {
      fromChain: order.fromToken.chainId, // Ethereum mainnet
      toChain: order.toToken.chainId, // Ethereum mainnet
      fromToken: order.fromToken.tokenAddress, // ETH
      toToken: order.toToken.tokenAddress, // YAWN
      fromAddress: "0x29d4C2CF7C3a32ca03Ab06B34EBfC5E350C4c491",
      toAddress: order.toToken.walletAddress,
      fromAmount: fromTokenAmount, // ETH in wei
      //integrator: "yawns-world-widget",
      //fee: PLATFORM_ORDER_FEE,
      slippage: 0.003, // 0.3%
    };
    const results = await getQuote(params);
    console.log("Quote:", results);

    const quote = results;

    if (quote && quote.transactionRequest) {
      const txHash = await sendTransaction(quote.transactionRequest); // generateRandomTransactionHash();

      let estimatedToAmtount = quote?.estimate?.toAmount;
      estimatedToAmtount = (estimatedToAmtount / 1e18).toFixed(4);

      const totalGasCost = await calculateTotalGasCost(quote?.estimate?.gasCosts);
      const totalGasCostFiat = totalGasCost * forexRates[order.currency]; // in selected fiat currency
      const totalFee = parseFloat(order.platformFee) + parseFloat(totalGasCostFiat);

      return {
        txHash: txHash,
        toTokenAmount: estimatedToAmtount,
        fromTokenAmount: (fromTokenAmount / 1e18).toFixed(8),
        networkFee: totalGasCostFiat?.toFixed(2),
        fee: totalFee?.toFixed(2)
      }
    }
    return;
  } catch (error) {
    console.error("Error executing quote:", error);
    throw error;
  }
}

const sendTransaction = async (transactionRequest) => {
  try {

    console.log("Signing and sending transaction...");

    // Sign and send the transaction
    const response = await wallet.sendTransaction(transactionRequest);

    // Wait for confirmation (optional)
    //const receipt = await response.wait();

    console.log("Transaction sent successfully!");
    console.log("Transaction hash:", response.hash);
    //console.log("Transaction receipt:", receipt);
    return response.hash;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

module.exports = {
  getTokenInformation,
  executeQuote,
};

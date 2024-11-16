const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with a TTL of 24 hours (86400 seconds)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Your Exchange Rate API URL
const API_URL = `https://v6.exchangerate-api.com/v6/${process.env.FOREX_API_KEY}/latest/USD`;

// Fetch exchange rate data and update cache
async function fetchExchangeRate() {
  try {
    const response = await axios.get(API_URL);
    const rates = response.data.conversion_rates;
    /*const usdRates = {
        USD: rates.USD,
        EUR: rates.EUR,
        GBP: rates.GBP,
        INR: rates.INR,
        AUD: rates.AUD
    };*/
    cache.set('usd_rates', rates); // Store USD rates
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
  }
}

// Get exchange rate from cache, refreshing if not present
async function getExchangeRate() {
  const cachedRate = cache.get('usd_rates');
  if (cachedRate) {
    return cachedRate; // Return cached rate if available
  }
  await fetchExchangeRate(); // Fetch and cache if not present
  return cache.get('usd_rates'); // Return newly cached rate
}

// Schedule the daily update at midnight (24 hours)
setInterval(fetchExchangeRate, 24 * 60 * 60 * 1000);

module.exports = { getExchangeRate };

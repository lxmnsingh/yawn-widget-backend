const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with a TTL of 24 hours (86400 seconds)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Fetch rate data and update cache
async function fetchTokenInformation(chain, token) {
    const API_URL = `https://li.quest/v1/token?chain=${chain}&token=${token}`;
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

module.exports = { getTokenInformation };

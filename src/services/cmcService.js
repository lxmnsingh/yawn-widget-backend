const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 7200, checkperiod: 3600 });

// create an axios instance
const ax = axios.create({
    baseURL: "https://pro-api.coinmarketcap.com/v2",
    headers: {
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
});

async function fetchLatestData(asset_id) {
    try {
        const response = await ax.get('/cryptocurrency/quotes/latest', {
            params: { id: asset_id },
        });
        cache.set(`cmc_${asset_id}`, response.data);
    } catch (error) {
        console.error("Error fetching cmc data:", error.message);
        throw error;
    }
}
// service methods

const cmcServices = {
    // fetch asset realted latest data available
    getLatestData: async () => {
        const asset_id = process.env.CMC_ASSET_ID || 33014;
        try {
            const cachedData = cache.get(`cmc_${asset_id}`);
            if (cachedData) {
                return cachedData; // Return cached data if available
            }
            await fetchLatestData(asset_id);
            return cache.get(`cmc_${asset_id}`);
        } catch (error) {
            console.error("Error getting CMC data:", error);
            throw error;
        }
    },
}

setInterval(fetchLatestData, 60 * 60 * 1000);

module.exports = cmcServices;
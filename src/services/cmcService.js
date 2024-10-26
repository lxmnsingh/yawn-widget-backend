const axios = require('axios');

// create an axios instance

const ax = axios.create({
    baseURL: "https://pro-api.coinmarketcap.com/v2",
    headers: {
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
});

// service methods

const cmcServices = {
    // fetch asset realted latest data available
    getLatestData: async () => {
        const asset_id = process.env.CMC_ASSET_ID || 33014;
        try {
            const response = await ax.get('/cryptocurrency/quotes/latest', {
                params: { id: asset_id },
            });
            return response.data;
        } catch (error) {
            console.error("Error getting CMC data:", error);
            throw error;
        }
    },
}

module.exports = cmcServices;
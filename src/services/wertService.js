const axios = require('axios');

// create an axios instance

const ax = axios.create({
    baseURL: "https://partner-sandbox.wert.io/api/external",
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.WERT_API_KEY,
    },
});

// service methods

const wertDataServices = {
    // get a list of all the orders for a user
    getOrders: async (user_id, params = { limit: 5, offset: 0, order_by: 'desc' }) => {
        try {
            const response = await ax.get('/orders', {
                params: { ...params, user_id },
            });
            return response.data;
        } catch (error) {
            console.error("Error getting orders:", error);
            throw error;
        }
    },

    // get a single order by order_id
    getOrder: async (search_by) => {
        try {
            const response = await ax.get('/orders', {params: search_by});
            if(response?.data?.data?.length>0) return response?.data?.data[0];
            console.log("Search by Response is:", response?.data?.data);
            return null;
        } catch (error) {
            console.error("Error getting order from Wert by id:", error);
            throw error;
        }
    },
}

module.exports = wertDataServices;
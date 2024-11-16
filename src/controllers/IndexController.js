// src/controllers/IndexController.js
const { isHttpError, InternalServerError } = require('http-errors');
const cmcServices = require('../services/cmcService');
const { getExchangeRate } = require('../services/forexService');
const { getTokenInformation } = require('../services/lifiService');

const ctrl = {

    getAssetLatestDataCMC: async (req, res, next) => {
        try {
            const response = await cmcServices.getLatestData();
            // Prepare the final data
            const finalData = {
                name: response.data[process.env.CMC_ASSET_ID].name,
                symbol: response.data[process.env.CMC_ASSET_ID].symbol,
                price: response.data[process.env.CMC_ASSET_ID].quote.USD.price,
                volume_24h: response.data[process.env.CMC_ASSET_ID].quote.USD.volume_24h,
                percent_change_24h: response.data[process.env.CMC_ASSET_ID].quote.USD.percent_change_24h,
                market_cap: response.data[process.env.CMC_ASSET_ID].quote.USD.market_cap
            };
            res.status(200).json(finalData);
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },

    getForexRates: async (req, res, next) => {
        try {
            const rates = await getExchangeRate();
            res.status(200).json(rates);
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },

    getTokenInfo: async (req, res, next) => {
        try {
            const chain = req.query.chain || "ETH";
            const token = req.query.token || "0x88Ce174C655B6d11210A069B2c106632DaBDB068"
            const data = await getTokenInformation(chain, token);
            res.status(200).json(data);
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },
};

module.exports = ctrl;
const Click = require('../models/Click');

const clickRepository = {
    saveClick: async (data, click_id) => {
        return await Click.findOneAndUpdate({ click_id: click_id }, data, { new: true, upsert: true });
    },

    getClick: async (click_id) => {
        return await Click.findOne({ click_id });
    }
};

module.exports = clickRepository;
const clickRepository = require('../repositories/clickRepository');

const clickService = {
    saveClick: async (data, click_id) => {
        return await clickRepository.saveClick(data, click_id);
    },
    getClick: async (click_id) => {
        return await clickRepository.getClick(click_id);
    }
};

module.exports = clickService;
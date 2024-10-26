const User = require('../models/User');

const userRepository = {
    updateUser: async (userData) => {
        const user = await User.findOneAndUpdate({ verifierId: userData.verifierId }, userData, { new: true, upsert: true });
        return user;
    },
    getUserByVerifierId: async (verifierId) => {
        return await User.findOne({ verifierId });
    },
};

module.exports = userRepository;
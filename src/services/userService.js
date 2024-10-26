const userRepository = require('../repositories/userRepository');

const userService = {
    getUserByVerifierId: async(verifierId)=>{
        return await userRepository.getUserByVerifierId(verifierId);
    },

    saveUser: async(userData)=>{
        return await userRepository.updateUser(userData);
    }
}

module.exports = userService;
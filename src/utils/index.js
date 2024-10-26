// src/utils/index.js

const utils = {
    extractFirstAndLastName: (fullName) => {
        if (!fullName) return { firstName: '', lastName: '' };
    
        const nameParts = fullName.trim().split(' ');
    
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
        return { firstName, lastName };
    },
};

module.exports = utils;
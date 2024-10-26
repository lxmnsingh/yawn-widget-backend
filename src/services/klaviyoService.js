const axios = require('axios');
const utils = require('../utils');

// Initialize Axios instance with Klaviyo configuration
const klaviyoAPI = axios.create({
    baseURL: process.env.KLAVIYO_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
        'revision': '2024-10-15'
    }
});

// Method to check if a profile exists
const profileExists = async (email) => {
    try {
        const response = await klaviyoAPI.get(`/profiles?filter=equals(email,"${email}")`);
        return response.data?.data?.length; // Returns true if profile exists, false otherwise
    } catch (error) {
        console.error('Error checking profile existence:', error);
        return false; // Consider profile not existing on error
    }
};

// Method to create or update a profile in Klaviyo
const createOrUpdateProfile = async (profileData) => {
    try {
        const response = await klaviyoAPI.post('/profiles/', { data: { type: 'profile', attributes: profileData } });
        return response.data.data.id; // Return the profile ID
    } catch (error) {
        console.error('Error creating or updating profile:', error);
        return null; // Return null to indicate failure
    }
};

// Method to subscribe a profile to a list
const subscribeProfileToList = async (profileId) => {
    try {
        const response = await klaviyoAPI.post(`/lists/${process.env.KLAVIYO_LIST_ID}/relationships/profiles/`, { data: [{ id: profileId, type: 'profile' }] });
        return response.data;
    } catch (error) {
        console.error('Error subscribing profile to list:', error);
        return null; // Return null to indicate failure
    }
};

// Main function to handle the subscription process
const subscribeUserToList = async (user) => {
    const { firstName, lastName } = utils.extractFirstAndLastName(user?.name);
    const profileData = {
        email: user?.email,
        first_name: firstName,
        last_name: lastName,
        phone_number: user?.phone
    };

    try {
        const exists = await profileExists(profileData.email);
        if (!exists) {
            // Step 1: Create or update the profile and get the profile ID
            const profileId = await createOrUpdateProfile(profileData);
            if (profileId) {
                // Step 2: Subscribe the profile to the list using the profile ID
                const subscriptionResult = await subscribeProfileToList(profileId);
                return subscriptionResult;
            } else {
                console.error("Failed to create or update profile. Skipping subscription.");
            }
        } else {
            console.log("Profile already exists, skipping creation.");
        }
    } catch (error) {
        console.error('Error in subscribing user to list:', error);
    }
};

module.exports = {
    subscribeUserToList
};

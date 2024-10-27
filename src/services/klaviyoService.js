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
const getProfileByEmail = async (email) => {
    try {
        const response = await klaviyoAPI.get(`/profiles?filter=equals(email,"${email}")`);
        return response.data?.data; // Returns profile if exists
    } catch (error) {
        console.error('Error checking profile existence:', error);
        return false; // Consider profile not existing on error
    }
};

// Method to create a profile in Klaviyo
const createProfile = async (profileData) => {
    try {
        const response = await klaviyoAPI.post('/profiles/', { data: { type: 'profile', attributes: profileData } });
        return response.data.data.id; // Return the profile ID
    } catch (error) {
        console.error('Error creating or updating profile:', error);
        return null; // Return null to indicate failure
    }
};

// Method to update a profile in Klaviyo
const updateProfile = async (profileData, profile_id) => {
    try {
        const response = await klaviyoAPI.patch(`/profiles/${profile_id}`, { data: { type: 'profile', attributes: profileData } });
        return response.data.data; // Return the profile ID
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
        phone_number: user?.phone,
        properties: {
            "Scenario":"NoPurchase"
        }
    };

    try {
        const profile = await getProfileByEmail(profileData.email);
        if (profile.length==0) {
            // Step 1: Create or update the profile and get the profile ID
            const profileId = await createProfile(profileData);
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

// Main function to handle adding scenarios to profiles
const updateSceneraioToProfile = async (user, scenario) => {

    const profileData = {
        "properties": {
          "Scenario": scenario
        }
      };
    try {
        const profile = await getProfileByEmail(user.email);
        console.log("Profile is:", profile);
        if (profile.length) {
            // Step 1: Create or update the profile and get the profile ID
            const updatedProfile = await updateProfile(profileData, profile.id);
            console.log("Updated profile:", updatedProfile);
            return updatedProfile;
        } else {
            console.log("Profile not found, skipping update.");
        }
    } catch (error) {
        console.error('Error in updating profile:', error);
    }
};

module.exports = {
    subscribeUserToList,
    updateSceneraioToProfile
};

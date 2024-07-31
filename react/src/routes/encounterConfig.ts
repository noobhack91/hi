import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const encounterConfig = async () => {
    try {
        const response = await axios.get(BahmniConstants.encounterConfigurationUrl, {
            params: { "callerContext": "REGISTRATION_CONCEPTS" },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching encounter configuration:', error);
        throw error;
    }
};

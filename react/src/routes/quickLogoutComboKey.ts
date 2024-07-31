import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const quickLogoutComboKey = async (): Promise<string> => {
    try {
        const response = await axios.get(BahmniConstants.globalPropertyUrl, {
            params: {
                property: 'bahmni.quickLogoutComboKey'
            },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quickLogoutComboKey:', error);
        throw error;
    }
};

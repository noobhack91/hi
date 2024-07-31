import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const identifierTypesConfig = async () => {
    try {
        const response = await axios.get(BahmniConstants.idgenConfigurationURL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching identifier types config:', error);
        throw error;
    }
};

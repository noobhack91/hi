import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const relationshipTypeConfig = async () => {
    try {
        const response = await axios.get(BahmniConstants.relationshipTypesUrl, {
            withCredentials: true,
            params: { v: "custom:(aIsToB,bIsToA,uuid)" }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching relationship type config:', error);
        throw error;
    }
};

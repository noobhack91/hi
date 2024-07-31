import axios from 'axios';
import { Bahmni } from '../utils/constants/Bahmni';

export const configurationService = {
    addressLevels: async function () {
        try {
            const response = await axios.get(`${Bahmni.Common.Constants.openmrsUrl}/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching address levels:', error);
            throw error;
        }
    }
};

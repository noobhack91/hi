import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const configurationService = {
    patientAttributesConfig: async function () {
        try {
            const response = await axios.get(BahmniConstants.personAttributeTypeUrl, {
                params: { v: 'custom:(uuid,name,sortWeight,description,format,concept)' },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching patient attributes config:', error);
            throw error;
        }
    }
};

import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const impressionConcept = async () => {
    try {
        const response = await axios.get(BahmniConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name)', name: BahmniConstants.impressionConcept },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching radiology impression config:', error);
        throw error;
    }
};

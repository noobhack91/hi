import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const dosageFrequencyConfig = async () => {
    try {
        const response = await axios.get(BahmniConstants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name,answers)',
                name: BahmniConstants.dosageFrequencyConceptName
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dosage frequency config:', error);
        throw error;
    }
};

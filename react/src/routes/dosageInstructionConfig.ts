import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const dosageInstructionConfig = async () => {
    try {
        const response = await axios.get(BahmniConstants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name,answers)',
                name: BahmniConstants.dosageInstructionConceptName
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dosage instruction config:', error);
        throw error;
    }
};

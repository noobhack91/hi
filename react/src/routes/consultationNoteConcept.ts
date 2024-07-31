import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const consultationNoteConcept = async () => {
    try {
        const response = await axios.get(BahmniConstants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name,answers)',
                name: BahmniConstants.consultationNoteConceptName
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation note concept:', error);
        throw error;
    }
};

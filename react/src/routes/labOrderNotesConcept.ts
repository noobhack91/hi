import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const labOrderNotesConcept = async () => {
    try {
        const response = await axios.get(BahmniConstants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name)',
                name: BahmniConstants.labOrderNotesConcept
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching lab order notes concept:', error);
        throw error;
    }
};

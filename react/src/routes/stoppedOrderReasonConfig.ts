import axios from 'axios';
import { Bahmni } from '../utils/constants/bahmni';

export const stoppedOrderReasonConfig = async () => {
    try {
        const response = await axios.get(Bahmni.Common.Constants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name,answers)',
                name: Bahmni.Common.Constants.stoppedOrderReasonConceptName
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stopped order reason config:', error);
        throw error;
    }
};

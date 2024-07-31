import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

export const enableAuditLog = async (): Promise<any> => {
    try {
        const response = await axios.get(BahmniConstants.globalPropertyUrl, {
            params: {
                property: 'bahmni.enableAuditLog'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching audit log configuration:', error);
        throw error;
    }
};

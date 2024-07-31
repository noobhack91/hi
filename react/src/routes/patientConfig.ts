import axios from 'axios';
import { Bahmni } from '../utils/constants/Bahmni';

export const configurationService = {
    patientConfig: async function () {
        try {
            const response = await axios.get(Bahmni.Common.Constants.patientConfigurationUrl, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching patient configuration:', error);
            throw error;
        }
    }
};

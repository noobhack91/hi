import axios from 'axios';
import { Bahmni } from '../utils/constants/Bahmni';

class QueryService {
    async getResponseFromQuery(params: any) {
        try {
            const response = await axios.get(Bahmni.Common.Constants.sqlUrl, {
                params: params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching query response:', error);
            throw error;
        }
    }
}

export default new QueryService();

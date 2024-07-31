import axios from 'axios';
import { Bahmni } from '../utils/constants/Bahmni';

class QueryService {
    getResponseFromQuery(params: any) {
        return axios.get(Bahmni.Common.Constants.sqlUrl, {
            params: params,
            withCredentials: true
        });
    }
}

export default new QueryService();

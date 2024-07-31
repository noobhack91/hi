import axios from 'axios';
import { adminImportStatusUrl } from '../utils/constants/adminImportStatusUrl';

class AdminImportService {
    getAllStatus(numberOfDays: number) {
        return axios.get(adminImportStatusUrl, {
            params: { numberOfDays: numberOfDays }
        });
    }
}

export default new AdminImportService();

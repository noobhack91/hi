import axios from 'axios';
import { BACTERIOLOGY_RESULTS_URL } from '../utils/constants';

interface BacteriologyResultsParams {
    patientUuid?: string;
    patientProgramUuid?: string;
}

interface Specimen {
    // Define the structure of the specimen object here
}

class BacteriologyResultsService {
    async getBacteriologyResults(data: BacteriologyResultsParams) {
        const params: any = {
            name: "BACTERIOLOGY CONCEPT SET",
            v: "full"
        };

        if (data.patientProgramUuid) {
            params.patientProgramUuid = data.patientProgramUuid;
            params.s = "byPatientProgram";
        } else if (data.patientUuid) {
            params.patientUuid = data.patientUuid;
        }

        try {
            const response = await axios.get(BACTERIOLOGY_RESULTS_URL, {
                params: params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            // Handle error appropriately
            throw error;
        }
    }

    async saveBacteriologyResults(specimen: Specimen) {
        try {
            const response = await axios.post(BACTERIOLOGY_RESULTS_URL, specimen, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            // Handle error appropriately
            throw error;
        }
    }
}

export default new BacteriologyResultsService();

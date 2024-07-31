import axios from 'axios';
import { parseLongDateToServerFormat } from '../utils/dateUtil';
import { diseaseSummaryPivotUrl } from '../utils/constants';

interface DiseaseSummaryConfig {
    numberOfVisits: number;
    initialCount: number;
    latestCount: number;
    obsConcepts: string[];
    drugConcepts: string[];
    labConcepts: string[];
    groupBy: string;
}

class PivotTableService {
    async getPivotTableFor(
        patientUuid: string,
        diseaseSummaryConfig: DiseaseSummaryConfig,
        visitUuid: string,
        startDate: Date,
        endDate: Date
    ): Promise<any> {
        const params = {
            patientUuid: patientUuid,
            visit: visitUuid,
            numberOfVisits: diseaseSummaryConfig.numberOfVisits,
            initialCount: diseaseSummaryConfig.initialCount,
            latestCount: diseaseSummaryConfig.latestCount,
            obsConcepts: diseaseSummaryConfig.obsConcepts,
            drugConcepts: diseaseSummaryConfig.drugConcepts,
            labConcepts: diseaseSummaryConfig.labConcepts,
            groupBy: diseaseSummaryConfig.groupBy,
            startDate: parseLongDateToServerFormat(startDate),
            endDate: parseLongDateToServerFormat(endDate)
        };

        try {
            const response = await axios.get(diseaseSummaryPivotUrl, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pivot table data', error);
            throw error;
        }
    }
}

export default new PivotTableService();

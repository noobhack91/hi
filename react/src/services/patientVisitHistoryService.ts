import VisitService from './visitService';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

class PatientVisitHistoryService {
    async getVisitHistory(patientUuid: string, currentVisitLocation: string) {
        try {
            const response = await VisitService.search({
                patient: patientUuid,
                v: 'custom:(uuid,visitType,startDatetime,stopDatetime,location,encounters:(uuid))',
                includeInactive: true
            });

            const visits = response.data.results.map((visitData: any) => new Bahmni.Clinical.VisitHistoryEntry(visitData));
            const activeVisit = visits.find((visit: any) => visit.isActive() && visit.isFromCurrentLocation(currentVisitLocation));

            return { visits, activeVisit };
        } catch (error) {
            console.error('Error fetching visit history:', error);
            throw error;
        }
    }
}

export default new PatientVisitHistoryService();

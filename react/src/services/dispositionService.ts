import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

class DispositionService {
    async getDispositionActions() {
        try {
            const response = await axios.get(`${BahmniConstants.conceptSearchByFullNameUrl}&name=${BahmniConstants.dispositionConcept}&v=custom:(uuid,name,answers:(uuid,name,mappings))`, { cache: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching disposition actions', error);
            throw error;
        }
    }

    async getDispositionNoteConcept() {
        try {
            const response = await axios.get(`${BahmniConstants.conceptSearchByFullNameUrl}&name=${BahmniConstants.dispositionNoteConcept}&v=custom:(uuid,name:(name))`, { cache: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching disposition note concept', error);
            throw error;
        }
    }

    async getDispositionByVisit(visitUuid: string) {
        try {
            const response = await axios.get(BahmniConstants.bahmniDispositionByVisitUrl, {
                params: {
                    visitUuid: visitUuid,
                    locale: this.getCurrentUserLocale()
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching disposition by visit', error);
            throw error;
        }
    }

    async getDispositionByPatient(patientUuid: string, numberOfVisits: number) {
        try {
            const response = await axios.get(BahmniConstants.bahmniDispositionByPatientUrl, {
                params: {
                    patientUuid: patientUuid,
                    numberOfVisits: numberOfVisits,
                    locale: this.getCurrentUserLocale()
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching disposition by patient', error);
            throw error;
        }
    }

    private getCurrentUserLocale(): string {
        // SECOND AGENT: [MISSING CONTEXT] - Implementation needed to fetch the current user's locale
        return 'en'; // Placeholder return value
    }
}

export default new DispositionService();

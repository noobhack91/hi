import axios from 'axios';
import { Bahmni } from '../utils/constants/bahmni';

class DiagnosisService {
    async getAllFor(searchTerm: string, locale?: string) {
        const url = Bahmni.Common.Constants.bahmniapiConceptUrl;
        const parameters: any = { term: searchTerm, limit: Bahmni.Common.Constants.emrapiDiagnosisLimit };
        if (locale) {
            parameters.locale = locale;
        }
        return axios.get(url, {
            params: parameters
        });
    }

    async getDiagnoses(patientUuid: string, visitUuid: string) {
        const url = Bahmni.Common.Constants.bahmniDiagnosisUrl;
        return axios.get(url, {
            params: { patientUuid, visitUuid }
        });
    }

    async getPatientDiagnosis(patientUuid: string) {
        const url = Bahmni.Common.Constants.bahmniDiagnosisUrl;
        return axios.get(url, {
            params: { patientUuid }
        });
    }

    async deleteDiagnosis(obsUuid: string) {
        const url = Bahmni.Common.Constants.bahmniDeleteDiagnosisUrl;
        return axios.get(url, {
            params: { obsUuid }
        });
    }

    async getDiagnosisConceptSet() {
        return axios.get(Bahmni.Common.Constants.conceptUrl, {
            params: {
                v: 'custom:(uuid,name,setMembers)',
                code: Bahmni.Common.Constants.diagnosisConceptSet,
                source: Bahmni.Common.Constants.emrapiConceptMappingSource
            },
            withCredentials: true
        });
    }

    async getPastAndCurrentDiagnoses(patientUuid: string, encounterUuid: string) {
        const response = await this.getDiagnoses(patientUuid);
        const diagnosisMapper = new Bahmni.DiagnosisMapper(); // SECOND AGENT: [MISSING CONTEXT] - $rootScope.diagnosisStatus is missing
        const allDiagnoses = diagnosisMapper.mapDiagnoses(response.data);
        const pastDiagnoses = diagnosisMapper.mapPastDiagnosis(allDiagnoses, encounterUuid);
        const savedDiagnosesFromCurrentEncounter = diagnosisMapper.mapSavedDiagnosesFromCurrentEncounter(allDiagnoses, encounterUuid);
        return {
            pastDiagnoses,
            savedDiagnosesFromCurrentEncounter
        };
    }

    async populateDiagnosisInformation(patientUuid: string, consultation: any) {
        const diagnosis = await this.getPastAndCurrentDiagnoses(patientUuid, consultation.encounterUuid);
        consultation.pastDiagnoses = diagnosis.pastDiagnoses;
        consultation.savedDiagnosesFromCurrentEncounter = diagnosis.savedDiagnosesFromCurrentEncounter;
        return consultation;
    }
}

export default new DiagnosisService();

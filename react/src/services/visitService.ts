import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';

class VisitService {
    getVisit(uuid: string, params?: string) {
        const parameters = params ? params : "custom:(uuid,visitId,visitType,patient,encounters:(uuid,encounterType,voided,orders:(uuid,orderType,voided,concept:(uuid,set,name),),obs:(uuid,value,concept,obsDatetime,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value:(uuid,name),groupMembers:(uuid,concept:(uuid,name),value:(uuid,name),groupMembers:(uuid,concept:(uuid,name),value:(uuid,name)))))))";
        return axios.get(`${BahmniConstants.visitUrl}/${uuid}`, {
            params: {
                v: parameters
            }
        });
    }

    endVisit(visitUuid: string) {
        return axios.post(`${BahmniConstants.endVisitUrl}?visitUuid=${visitUuid}`, {}, {
            withCredentials: true
        });
    }

    endVisitAndCreateEncounter(visitUuid: string, bahmniEncounterTransaction: any) {
        return axios.post(`${BahmniConstants.endVisitAndCreateEncounterUrl}?visitUuid=${visitUuid}`, bahmniEncounterTransaction, {
            withCredentials: true
        });
    }

    updateVisit(visitUuid: string, attributes: any) {
        return axios.post(`${BahmniConstants.visitUrl}/${visitUuid}`, attributes, {
            withCredentials: true
        });
    }

    createVisit(visitDetails: any) {
        return axios.post(BahmniConstants.visitUrl, visitDetails, {
            withCredentials: true
        });
    }

    checkIfActiveVisitExists(patientUuid: string, visitLocationUuid: string) {
        return axios.get(BahmniConstants.visitUrl, {
            params: {
                includeInactive: false,
                patient: patientUuid,
                location: visitLocationUuid
            },
            withCredentials: true
        });
    }

    getVisitSummary(visitUuid: string) {
        return axios.get(BahmniConstants.visitSummaryUrl, {
            params: {
                visitUuid: visitUuid
            },
            withCredentials: true
        });
    }

    search(parameters: any) {
        return axios.get(BahmniConstants.visitUrl, {
            params: parameters,
            withCredentials: true
        });
    }

    getVisitType() {
        return axios.get(BahmniConstants.visitTypeUrl, {
            withCredentials: true
        });
    }
}

export default new VisitService();

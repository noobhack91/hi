import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

const v = 'custom:(uuid,strength,drugReferenceMaps,name,dosageForm,concept:(uuid,name,names:(name)))';

const search = async (drugName: string, conceptUuid: string) => {
    const params = {
        v: v,
        q: drugName,
        conceptUuid: conceptUuid,
        s: "ordered"
    };
    const response = await axios.get(BahmniCommonConstants.drugUrl, {
        params: params,
        withCredentials: true
    });
    return response.data.results;
};

const getSetMembersOfConcept = async (conceptSetFullySpecifiedName: string, searchTerm: string) => {
    const params = {
        v: v,
        q: conceptSetFullySpecifiedName,
        s: "byConceptSet",
        searchTerm: searchTerm
    };
    const response = await axios.get(BahmniCommonConstants.drugUrl, {
        params: params,
        withCredentials: true
    });
    return response.data.results;
};

const getRegimen = async (patientUuid: string, patientProgramUuid: string, drugs: string) => {
    const params = {
        patientUuid: patientUuid,
        patientProgramUuid: patientProgramUuid,
        drugs: drugs
    };
    const response = await axios.get(`${BahmniCommonConstants.bahmniRESTBaseURL}/drugOGram/regimen`, {
        params: params,
        withCredentials: true
    });
    return response.data;
};

const sendDiagnosisDrugBundle = async (bundle: any) => {
    const response = await axios.post(BahmniCommonConstants.cdssUrl, bundle, {
        withCredentials: true,
        params: { service: 'medication-order-select' }
    });
    return response.data;
};

const cdssAudit = async (patientUuid: string, eventType: string, message: string, module: string) => {
    const alertData = {
        patientUuid: patientUuid,
        eventType: eventType,
        message: message,
        module: module
    };
    const response = await axios.post(BahmniCommonConstants.auditLogUrl, alertData, {
        withCredentials: true
    });
    return response.data;
};

const getDrugConceptSourceMapping = async (drugUuid: string) => {
    const params = {
        _id: drugUuid
    };
    const response = await axios.get(BahmniCommonConstants.fhirMedicationsUrl, {
        params: params,
        withCredentials: true
    });
    return response.data;
};

const getCdssEnabled = async () => {
    const params = {
        property: 'cdss.enable'
    };
    const response = await axios.get(BahmniCommonConstants.globalPropertyUrl, {
        params: params,
        withCredentials: true
    });
    return response.data;
};

export const drugService = {
    search,
    getRegimen,
    getSetMembersOfConcept,
    sendDiagnosisDrugBundle,
    getDrugConceptSourceMapping,
    getCdssEnabled,
    cdssAudit
};

import axios from 'axios';
import { BahmniCommonConstants, BahmniOTConstants } from '../utils/constants';

class SurgicalAppointmentService {
    getSurgeons() {
        return axios.get(BahmniCommonConstants.providerUrl, {
            params: { v: "custom:(id,uuid,person:(uuid,display),attributes:(attributeType:(display),value))" },
            withCredentials: true
        });
    }

    saveSurgicalBlock(data: any) {
        return axios.post(BahmniOTConstants.addSurgicalBlockUrl, data, {
            params: { v: "full" },
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    updateSurgicalBlock(data: any) {
        return axios.post(`${BahmniOTConstants.addSurgicalBlockUrl}/${data.uuid}`, data, {
            params: { v: "full" },
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    updateSurgicalAppointment(data: any) {
        return axios.post(`${BahmniOTConstants.updateSurgicalAppointmentUrl}/${data.uuid}`, data, {
            params: { v: "full" },
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    getSurgicalAppointmentAttributeTypes() {
        return axios.get(BahmniOTConstants.surgicalAppointmentAttributeTypeUrl, {
            params: { v: "custom:(uuid,name,format)" },
            withCredentials: true
        });
    }

    getSurgicalBlockFor(surgicalBlockUuid: string) {
        return axios.get(`${BahmniOTConstants.addSurgicalBlockUrl}/${surgicalBlockUuid}`, {
            params: { v: "full" },
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    getSurgicalBlocksInDateRange(startDatetime: string, endDatetime: string, includeVoided: boolean, activeBlocks: boolean) {
        // SECOND AGENT: [MISSING CONTEXT] - additionalCustomParam is retrieved from appService which is not defined in the provided context
        const additionalCustomParam = ''; // Placeholder for additionalCustomParam
        return axios.get(BahmniOTConstants.addSurgicalBlockUrl, {
            params: {
                startDatetime,
                endDatetime,
                includeVoided: includeVoided || false,
                activeBlocks: activeBlocks || false,
                v: `custom:(id,uuid,provider:(uuid,person:(uuid,display),attributes:(attributeType:(display),value,voided)),location:(uuid,name),startDatetime,endDatetime,surgicalAppointments:(id,uuid,patient:(uuid,display,person:(age,gender,birthdate)),actualStartDatetime,actualEndDatetime,status,notes,sortWeight,bedNumber,bedLocation,surgicalAppointmentAttributes${additionalCustomParam ? `,${additionalCustomParam}` : ''}))`
            },
            withCredentials: true
        });
    }

    getPrimaryDiagnosisConfigForOT() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'obs.conceptMappingsForOT' },
            withCredentials: true,
            headers: { Accept: 'text/plain' }
        });
    }

    getBulkNotes(startDate: string, endDate: string) {
        return axios.get(BahmniOTConstants.notesUrl, {
            params: {
                noteType: 'OT Module',
                noteStartDate: startDate,
                noteEndDate: endDate
            },
            withCredentials: true
        });
    }
}

export default new SurgicalAppointmentService();

import axios from 'axios';
import { format } from 'date-fns';
import useMessagingService from './messagingService';

const DateUtil = {
    parseLongDateToServerFormat: (date: string) => {
        // SECOND AGENT: [MISSING CONTEXT] - Implementation of parseLongDateToServerFormat is missing
        return date;
    },
    getDateTimeInSpecifiedFormat: (date: string, formatStr: string) => {
        return format(new Date(date), formatStr);
    }
};

const convertToLocalDate = (date: string) => {
    const localDate = DateUtil.parseLongDateToServerFormat(date);
    return DateUtil.getDateTimeInSpecifiedFormat(localDate, 'MMMM do, yyyy [at] h:mm:ss a');
};

const getUuidForAnonymiseConcept = async () => {
    const params = {
        name: 'FHIR Export Anonymise Flag',
        s: 'default',
        v: 'default'
    };
    try {
        const response = await axios.get('/openmrs/ws/rest/v1/concept', { params });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
    }
};

const loadFhirTasks = async () => {
    const params = {
        "_sort:desc": "_lastUpdated",
        _count: 50
    };
    try {
        const response = await axios.get('/openmrs/ws/rest/v1/fhir/Task', { params });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
    }
};

const submitAudit = async (username: string, startDate: string, endDate: string, anonymise: boolean) => {
    const eventType = "PATIENT_DATA_BULK_EXPORT";
    const exportMode = anonymise ? "Anonymized" : "Non-Anonymized";
    const message = `User ${username} performed a bulk patient data export for: Start Date ${convertToLocalDate(startDate)} and End Date ${convertToLocalDate(endDate)} in ${exportMode} mode`;
    const module = "Export";
    const auditData = {
        username,
        eventType,
        message,
        module
    };
    try {
        const response = await axios.post('/openmrs/ws/rest/v1/auditlog', auditData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
    }
};

const exportData = async (username: string, startDate: string, endDate: string, anonymise: boolean) => {
    let url = `/openmrs/ws/rest/v1/fhir/Export?anonymise=${anonymise}`;
    if (startDate) {
        url += `&startDate=${startDate}`;
    }
    if (endDate) {
        url += `&endDate=${endDate}`;
    }
    try {
        const response = await axios.post(url, {}, {
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        // Handle error
        console.error(error);
    }
};

export {
    getUuidForAnonymiseConcept,
    loadFhirTasks,
    submitAudit,
    exportData
};

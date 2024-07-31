import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';
import { enableAuditLog } from '../routes/enableAuditLog';

const DateUtil = {
    parseLongDateToServerFormat: (date: string) => {
        // SECOND AGENT: [MISSING CONTEXT] - Implementation of parseLongDateToServerFormat
    },
    getDateTimeInSpecifiedFormat: (date: string, format: string) => {
        // SECOND AGENT: [MISSING CONTEXT] - Implementation of getDateTimeInSpecifiedFormat
    }
};

const convertToLocalDate = (date: string): string => {
    const localDate = DateUtil.parseLongDateToServerFormat(date);
    return DateUtil.getDateTimeInSpecifiedFormat(localDate, 'MMMM Do, YYYY [at] h:mm:ss A');
};

export const getLogs = async (params: Record<string, any> = {}): Promise<any[]> => {
    try {
        const response = await axios.get(BahmniConstants.auditLogUrl, { params });
        return response.data.map((log: any) => {
            log.dateCreated = convertToLocalDate(log.dateCreated);
            const entity = log.message ? log.message.split("~")[1] : undefined;
            log.params = entity ? JSON.parse(entity) : entity;
            log.message = log.message.split("~")[0];
            log.displayMessage = log.message; // SECOND AGENT: [MISSING CONTEXT] - Translation logic for displayMessage
            return log;
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};

export const log = async (patientUuid: string, eventType: string, messageParams: Record<string, any>, module: string): Promise<void> => {
    try {
        const result = await enableAuditLog();
        if (result.enableAuditLog) {
            const params: Record<string, any> = {};
            params.patientUuid = patientUuid;
            params.eventType = BahmniConstants.AuditLogEventDetails[eventType].eventType;
            params.message = BahmniConstants.AuditLogEventDetails[eventType].message;
            params.message = messageParams ? params.message + '~' + JSON.stringify(messageParams) : params.message;
            params.module = module;
            await axios.post(BahmniConstants.auditLogUrl, params, { withCredentials: true });
        }
    } catch (error) {
        console.error('Error logging event:', error);
        throw error;
    }
};

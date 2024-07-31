import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';
import { configurations } from './configurations';
import { log } from './auditLogService';
import useMessagingService from './messagingService';
import { useTranslation } from 'react-i18next';

const removeVoidedDocuments = async (documents: any[]) => {
    for (const document of documents) {
        if (document.voided && document.image) {
            const url = `${BahmniConstants.RESTWS_V1}/bahmnicore/visitDocument?filename=${document.image}`;
            await axios.delete(url, { withCredentials: true });
        }
    }
};

export const saveVisitDocument = async (visitDocument: any) => {
    const url = `${BahmniConstants.RESTWS_V1}/bahmnicore/visitDocument`;
    const isNewVisit = !visitDocument.visitUuid;
    await removeVoidedDocuments(visitDocument.documents);
    const visitTypeName = configurations.encounterConfig().getVisitTypeByUuid(visitDocument.visitTypeUuid)['name'];
    const encounterTypeName = configurations.encounterConfig().getEncounterTypeByUuid(visitDocument.encounterTypeUuid)['name'];

    try {
        const response = await axios.post(url, visitDocument, { withCredentials: true });
        if (isNewVisit) {
            await log(visitDocument.patientUuid, "OPEN_VISIT", { visitUuid: response.data.visitUuid, visitType: visitTypeName }, encounterTypeName);
        }
        await log(visitDocument.patientUuid, "EDIT_ENCOUNTER", { encounterUuid: response.data.encounterUuid, encounterType: encounterTypeName }, encounterTypeName);
        return response;
    } catch (error) {
        console.error('Error saving visit document:', error);
        throw error;
    }
};

export const saveFile = async (file: string, patientUuid: string, encounterTypeName: string, fileName: string, fileType: string) => {
    const searchStr = ";base64";
    let format = file.split(searchStr)[0].split("/")[1];
    if (fileType === "video") {
        format = fileName.split(".").pop()!;
    }
    const url = `${BahmniConstants.RESTWS_V1}/bahmnicore/visitDocument/uploadDocument`;

    try {
        const response = await axios.post(url, {
            content: file.substring(file.indexOf(searchStr) + searchStr.length),
            format: format,
            patientUuid: patientUuid,
            encounterTypeName: encounterTypeName,
            fileType: fileType || "file",
            fileName: fileName.substring(0, fileName.lastIndexOf('.'))
        }, {
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        const { showMessage } = useMessagingService();
        const { t } = useTranslation();
        if (error.response && error.response.status === 413) {
            if (!isNaN(error.response.data.maxDocumentSizeMB)) {
                const maxAllowedSize = roundToNearestHalf(error.response.data.maxDocumentSizeMB * 0.70);
                showMessage("error", t("FILE_SIZE_LIMIT_EXCEEDED_MESSAGE", { maxAllowedSize }));
            } else {
                showMessage("error", t("SIZE_LIMIT_EXCEEDED_MESSAGE"));
            }
        }
        return Promise.reject(error);
    }
};

const roundToNearestHalf = (value: number) => {
    const floorValue = Math.floor(value);
    return (value - floorValue) < 0.5 ? floorValue : floorValue + 0.5;
};

export const getFileType = (fileType: string) => {
    const pdfType = "pdf";
    const imageType = "image";
    if (fileType.includes(pdfType)) {
        return pdfType;
    }
    if (fileType.includes(imageType)) {
        return imageType;
    }
    return "not_supported";
};

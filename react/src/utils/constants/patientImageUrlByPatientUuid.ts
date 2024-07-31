const hostUrl: string = "http://your-host-url"; // Replace with actual host URL
const RESTWS_V1: string = `${hostUrl}/openmrs/ws/rest/v1`;

export const patientImageUrlByPatientUuid: string = `${RESTWS_V1}/patientImage?patientUuid=`;

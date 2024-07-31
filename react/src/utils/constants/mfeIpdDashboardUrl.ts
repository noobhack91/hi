const hostURL = 'http://example.com'; // Replace with the actual host URL

export const mfeIpdDashboardUrl = (patientUuid: string, visitUuid: string): string => {
    return `${hostURL}/bahmni/clinical/#/default/patient/${patientUuid}/dashboard/visit/ipd/${visitUuid}?source=adt`;
};

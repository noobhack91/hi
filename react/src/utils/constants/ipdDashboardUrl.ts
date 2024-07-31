// Type definition for the IPD Dashboard URL parameters
interface IpdDashboardUrlParams {
    patientUuid: string;
    visitUuid: string;
}

// Constant for the IPD Dashboard URL
export const ipdDashboardUrl = (params: IpdDashboardUrlParams): string => {
    return `#/patient/${params.patientUuid}/visit/${params.visitUuid}/`;
};

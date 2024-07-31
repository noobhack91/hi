import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

interface BedDetails {
    wardName: string;
    wardUuid: string;
    physicalLocationName: string;
    bedNumber: string;
    bedId: string;
}

class BedService {
    private mapBedDetails(response: any): BedDetails | undefined {
        const results = response.data.results;
        if (results && results.length > 0) {
            const bed = results[0];
            return {
                wardName: bed.physicalLocation.parentLocation.display,
                wardUuid: bed.physicalLocation.parentLocation.uuid,
                physicalLocationName: bed.physicalLocation.name,
                bedNumber: bed.bedNumber,
                bedId: bed.bedId
            };
        }
    }

    public async setBedDetailsForPatientOnRootScope(uuid: string): Promise<BedDetails | undefined> {
        const bedDetails = await this.getAssignedBedForPatient(uuid);

        // Assuming we have a global state management system like Redux or Context API
        // Here, we will use a hypothetical `setGlobalBedDetails` function to set the bed details in the global state
        if (bedDetails) {
            setGlobalBedDetails(bedDetails);
        }
        return bedDetails;
    }

    public async getAssignedBedForPatient(patientUuid: string, visitUuid?: string): Promise<BedDetails | undefined> {
        const params: any = {
            patientUuid: patientUuid,
            v: "full"
        };
        if (visitUuid) {
            params.visitUuid = visitUuid;
            params.s = 'bedDetailsFromVisit';
        }
        const response = await axios.get(BahmniCommonConstants.bedFromVisit, {
            params: params,
            withCredentials: true
        });
        return this.mapBedDetails(response);
    }

    public async assignBed(bedId: string, patientUuid: string, encounterUuid: string): Promise<void> {
        const patientJson = { patientUuid: patientUuid, encounterUuid: encounterUuid };
        await axios.post(`${BahmniCommonConstants.bedFromVisit}/${bedId}`, patientJson, {
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    public async getBedInfo(bedId: string): Promise<any> {
        return axios.get(`${BahmniCommonConstants.bedFromVisit}/${bedId}?v=custom:(bedId,bedNumber,patients:(uuid,person:(age,personName:(givenName,familyName),gender),identifiers:(uuid,identifier),),physicalLocation:(name))`, {
            withCredentials: true
        });
    }

    public async getCompleteBedDetailsByBedId(bedId: string): Promise<any> {
        return axios.get(`${BahmniCommonConstants.bedFromVisit}/${bedId}`, {
            withCredentials: true
        });
    }
}

export default new BedService();

import axios from 'axios';

class PacsService {
    async search(patientId: string) {
        const params = {
            patientId: patientId
        };
        try {
            const response = await axios.get('/openmrs/ws/rest/v1/pacs/studies', {
                params: params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    getAccessionNumber(identifier: { system: string, value: string }): string | null {
        if (identifier.system.indexOf("urn:bahmni:accession") < 0) {
            return null;
        }
        const parts = identifier.value.split("urn:oid:");
        return parts && parts.length === 2 ? parts[1] : "";
    }
}

export default new PacsService();

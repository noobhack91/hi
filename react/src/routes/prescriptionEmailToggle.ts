import axios from 'axios';

const GLOBAL_PROPERTY_URL = '/openmrs/ws/rest/v1/bahmnicore/sql/globalproperty';

export const getPrescriptionEmailToggle = async (): Promise<string> => {
    try {
        const response = await axios.get(GLOBAL_PROPERTY_URL, {
            params: {
                property: 'bahmni.enableEmailPrescriptionOption'
            },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching prescription email toggle:', error);
        throw error;
    }
};

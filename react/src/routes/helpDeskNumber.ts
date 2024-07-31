import axios from 'axios';

const GLOBAL_PROPERTY_URL = '/openmrs/ws/rest/v1/bahmnicore/sql/globalproperty';

export const getHelpDeskNumber = async (): Promise<string> => {
    try {
        const response = await axios.get(GLOBAL_PROPERTY_URL, {
            params: {
                property: 'clinic.helpDeskNumber'
            },
            withCredentials: true,
            transformResponse: [(data) => {
                return data;
            }]
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching help desk number:', error);
        throw error;
    }
};

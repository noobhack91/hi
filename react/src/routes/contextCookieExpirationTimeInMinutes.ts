import axios from 'axios';

const GLOBAL_PROPERTY_URL = '/openmrs/ws/rest/v1/bahmniie/globalProperty';

export const getContextCookieExpirationTimeInMinutes = async (): Promise<string> => {
    try {
        const response = await axios.get(GLOBAL_PROPERTY_URL, {
            params: {
                property: 'bahmni.contextCookieExpirationTimeInMinutes'
            },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching context cookie expiration time:', error);
        throw error;
    }
};

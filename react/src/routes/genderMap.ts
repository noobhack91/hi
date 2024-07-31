import axios from 'axios';

const GENDER_MAP_PROPERTY = 'mrs.genders';
const GLOBAL_PROPERTY_URL = '/openmrs/ws/rest/v1/globalproperty';

export const fetchGenderMap = async () => {
    try {
        const response = await axios.get(GLOBAL_PROPERTY_URL, {
            params: {
                property: GENDER_MAP_PROPERTY
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching gender map:', error);
        throw error;
    }
};

import axios from 'axios';

const defaultEncounterType = async () => {
    try {
        const response = await axios.get('/openmrs/ws/rest/v1/bahmniie/globalProperty', {
            params: {
                property: 'bahmni.encounterType.default'
            },
            withCredentials: true,
            transformResponse: [(data) => {
                return data;
            }]
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching default encounter type:', error);
        throw error;
    }
};

export default defaultEncounterType;

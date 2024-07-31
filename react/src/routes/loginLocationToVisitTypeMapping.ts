import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

export const loginLocationToVisitTypeMapping = async () => {
    const url = BahmniCommonConstants.entityMappingUrl;
    try {
        const response = await axios.get(url, {
            params: {
                mappingType: 'loginlocation_visittype',
                s: 'byEntityAndMappingType'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching login location to visit type mapping:', error);
        throw error;
    }
};

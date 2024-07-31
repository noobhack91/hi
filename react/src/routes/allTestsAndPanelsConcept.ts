import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

export const configurationService = {
    allTestsAndPanelsConcept: async function () {
        try {
            const response = await axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
                params: {
                    v: 'custom:(uuid,name:(uuid,name),setMembers:(uuid,name:(uuid,name)))',
                    name: BahmniCommonConstants.allTestsAndPanelsConceptName
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all tests and panels concept:', error);
            throw error;
        }
    }
};

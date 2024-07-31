import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

interface UrlMap {
    personName: string;
    personAttribute: string;
}

class PatientAttributeService {
    private urlMap: UrlMap;

    constructor() {
        this.urlMap = {
            personName: BahmniCommonConstants.bahmniSearchUrl + "/personname",
            personAttribute: BahmniCommonConstants.bahmniSearchUrl + "/personattribute"
        };
    }

    public search(fieldName: string, query: string, type: keyof UrlMap) {
        const url = this.urlMap[type];
        const queryWithoutTrailingSpaces = query.trimLeft();

        return axios.get(url, {
            params: { q: queryWithoutTrailingSpaces, key: fieldName },
            withCredentials: true
        });
    }
}

export default new PatientAttributeService();

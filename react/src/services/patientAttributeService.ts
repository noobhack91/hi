import axios from 'axios';

interface UrlMap {
    personName: string;
    personAttribute: string;
}

class PatientAttributeService {
    private urlMap: UrlMap;

    constructor() {
        this.urlMap = {
            personName: `${process.env.REACT_APP_BAHMNI_SEARCH_URL}/personname`,
            personAttribute: `${process.env.REACT_APP_BAHMNI_SEARCH_URL}/personattribute`
        };
    }

    public async search(fieldName: string, query: string, type: keyof UrlMap) {
        const url = this.urlMap[type];
        const queryWithoutTrailingSpaces = query.trimLeft();

        try {
            const response = await axios.get(url, {
                params: { q: queryWithoutTrailingSpaces, key: fieldName },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data from ${url}: ${error.message}`);
        }
    }
}

export default new PatientAttributeService();

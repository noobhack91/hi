import { titleTranslate } from '../utils/titleTranslate';
import axios from 'axios';

interface Concept {
    uuid: string;
    name: string;
    conceptClass?: string;
    setMembers?: Concept[];
}

interface LabConceptsMapper {
    map: (labConceptsSet: Concept, labDepartmentsSet: Concept) => any;
}

class LabTestsProvider {
    private labConceptsMapper: LabConceptsMapper;

    constructor(labConceptsMapper: LabConceptsMapper) {
        this.labConceptsMapper = labConceptsMapper;
    }

    async getTests(): Promise<any> {
        try {
            const labConceptsResponse = await axios.get('/openmrs/ws/rest/v1/concept', {
                params: {
                    name: 'Bahmni.Clinical.Constants.labConceptSetName',
                    v: 'custom:(uuid,setMembers:(uuid,name,conceptClass,setMembers:(uuid,name,conceptClass,setMembers:(uuid,name,conceptClass))))'
                }
            });

            const departmentConceptsResponse = await axios.get('/openmrs/ws/rest/v1/concept', {
                params: {
                    name: 'Bahmni.Clinical.Constants.labDepartmentsConceptSetName',
                    v: 'custom:(uuid,setMembers:(uuid,name,setMembers:(uuid,name)))'
                }
            });

            const labConceptsSet = labConceptsResponse.data.results[0];
            const labDepartmentsSet = departmentConceptsResponse.data.results[0];
            const tests = this.labConceptsMapper.map(labConceptsSet, labDepartmentsSet);

            return tests;
        } catch (error) {
            throw new Error('Error fetching lab tests: ' + error.message);
        }
    }
}

export default LabTestsProvider;

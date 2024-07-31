import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

class ConfigurationService {
    private existingPromises: { [key: string]: Promise<any> } = {};
    private configurations: { [key: string]: any } = {};

    private encounterConfig() {
        return axios.get(BahmniCommonConstants.encounterConfigurationUrl, {
            params: { "callerContext": "REGISTRATION_CONCEPTS" },
            withCredentials: true
        });
    }

    private patientConfig() {
        return axios.get(BahmniCommonConstants.patientConfigurationUrl, {
            withCredentials: true
        });
    }

    private patientAttributesConfig() {
        return axios.get(BahmniCommonConstants.personAttributeTypeUrl, {
            params: { v: 'custom:(uuid,name,sortWeight,description,format,concept)' },
            withCredentials: true
        });
    }

    private dosageFrequencyConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name,answers)', name: BahmniCommonConstants.dosageFrequencyConceptName },
            withCredentials: true
        });
    }

    private dosageInstructionConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name,answers)', name: BahmniCommonConstants.dosageInstructionConceptName },
            withCredentials: true
        });
    }

    private stoppedOrderReasonConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name,answers)', name: BahmniCommonConstants.stoppedOrderReasonConceptName },
            withCredentials: true
        });
    }

    private consultationNoteConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name,answers)', name: BahmniCommonConstants.consultationNoteConceptName },
            withCredentials: true
        });
    }

    private radiologyObservationConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name)', name: BahmniCommonConstants.radiologyResultConceptName },
            withCredentials: true
        });
    }

    private labOrderNotesConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name)', name: BahmniCommonConstants.labOrderNotesConcept },
            withCredentials: true
        });
    }

    private defaultEncounterType() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.encounterType.default' },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
    }

    private radiologyImpressionConfig() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: { v: 'custom:(uuid,name)', name: BahmniCommonConstants.impressionConcept },
            withCredentials: true
        });
    }

    private addressLevels() {
        return axios.get(`${BahmniCommonConstants.openmrsUrl}/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form`, {
            withCredentials: true
        });
    }

    private allTestsAndPanelsConcept() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: {
                v: 'custom:(uuid,name:(uuid,name),setMembers:(uuid,name:(uuid,name)))',
                name: BahmniCommonConstants.allTestsAndPanelsConceptName
            },
            withCredentials: true
        });
    }

    private identifierTypesConfig() {
        return axios.get(BahmniCommonConstants.idgenConfigurationURL, {
            withCredentials: true
        });
    }

    private genderMap() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'mrs.genders' },
            withCredentials: true
        });
    }

    private relationshipTypeMap() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.relationshipTypeMap' },
            withCredentials: true
        });
    }

    private relationshipTypeConfig() {
        return axios.get(BahmniCommonConstants.relationshipTypesUrl, {
            params: { v: "custom:(aIsToB,bIsToA,uuid)" },
            withCredentials: true
        });
    }

    private loginLocationToVisitTypeMapping() {
        return axios.get(BahmniCommonConstants.entityMappingUrl, {
            params: {
                mappingType: 'loginlocation_visittype',
                s: 'byEntityAndMappingType'
            }
        });
    }

    private enableAuditLog() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.enableAuditLog' },
            withCredentials: true
        });
    }

    private helpDeskNumber() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'clinic.helpDeskNumber' },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
    }

    private prescriptionEmailToggle() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.enableEmailPrescriptionOption' },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
    }

    private quickLogoutComboKey() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.quickLogoutComboKey' },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
    }

    private contextCookieExpirationTimeInMinutes() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
            params: { property: 'bahmni.contextCookieExpirationTimeInMinutes' },
            withCredentials: true,
            transformResponse: [(data) => data]
        });
    }

    public getConfigurations(configurationNames: string[]): Promise<any> {
        const promises: Promise<any>[] = [];

        configurationNames.forEach((configurationName) => {
            if (!this.existingPromises[configurationName]) {
                this.existingPromises[configurationName] = this[configurationName]().then((response) => {
                    this.configurations[configurationName] = response.data;
                });
                promises.push(this.existingPromises[configurationName]);
            }
        });

        return Promise.all(promises).then(() => this.configurations);
    }
}

export default new ConfigurationService();

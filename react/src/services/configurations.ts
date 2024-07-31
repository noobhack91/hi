import axios from 'axios';
import { BahmniConstants } from '../utils/constants/BahmniConstants';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';
import defaultEncounterType from '../routes/defaultEncounterType';
import { fetchGenderMap } from '../routes/genderMap';
import { getHelpDeskNumber } from '../routes/helpDeskNumber';
import { getPrescriptionEmailToggle } from '../routes/prescriptionEmailToggle';
import { quickLogoutComboKey } from '../routes/quickLogoutComboKey';
import { getContextCookieExpirationTimeInMinutes } from '../routes/contextCookieExpirationTimeInMinutes';
import { configurationService as patientConfigService } from '../routes/patientConfig';
import { configurationService as patientAttributesConfigService } from '../routes/patientAttributesConfig';
import { configurationService as radiologyObservationConfigService } from '../routes/radiologyObservationConfig';
import { configurationService as radiologyImpressionConfigService } from '../routes/radiologyImpressionConfig';
import { configurationService as addressLevelsService } from '../routes/addressLevels';
import { configurationService as relationshipTypeMapService } from '../routes/relationshipTypeMap';
import { configurationService as allTestsAndPanelsConceptService } from '../routes/allTestsAndPanelsConcept';
import { encounterConfig } from '../routes/encounterConfig';
import { dosageFrequencyConfig } from '../routes/dosageFrequencyConfig';
import { dosageInstructionConfig } from '../routes/dosageInstructionConfig';
import { stoppedOrderReasonConfig } from '../routes/stoppedOrderReasonConfig';
import { consultationNoteConfig } from '../routes/consultationNoteConfig';
import { labOrderNotesConfig } from '../routes/labOrderNotesConfig';
import { identifierTypesConfig } from '../routes/identifierTypesConfig';
import { relationshipTypeConfig } from '../routes/relationshipTypeConfig';
import { loginLocationToVisitTypeMapping } from '../routes/loginLocationToVisitTypeMapping';
import { enableAuditLog } from '../routes/enableAuditLog';

interface Configurations {
    [key: string]: any;
}

class ConfigurationsService {
    private configs: Configurations = {};

    async load(configNames: string[]): Promise<void> {
        const missingConfigs = configNames.filter(name => !this.configs[name]);
        if (missingConfigs.length > 0) {
            const configurations = await this.getConfigurations(missingConfigs);
            this.configs = { ...this.configs, ...configurations };
        }
    }

    private async getConfigurations(configNames: string[]): Promise<Configurations> {
        const configPromises = configNames.map(name => this.fetchConfig(name));
        const configResults = await Promise.all(configPromises);
        return configResults.reduce((acc, config, index) => {
            acc[configNames[index]] = config;
            return acc;
        }, {} as Configurations);
    }

    private async fetchConfig(configName: string): Promise<any> {
        switch (configName) {
            case 'dosageInstructionConfig':
                return await dosageInstructionConfig();
            case 'stoppedOrderReasonConfig':
                return await stoppedOrderReasonConfig();
            case 'dosageFrequencyConfig':
                return await dosageFrequencyConfig();
            case 'allTestsAndPanelsConcept':
                return await allTestsAndPanelsConceptService.allTestsAndPanelsConcept();
            case 'radiologyImpressionConfig':
                return await radiologyImpressionConfigService.radiologyImpressionConfig();
            case 'labOrderNotesConfig':
                return await labOrderNotesConfig();
            case 'consultationNoteConfig':
                return await consultationNoteConfig();
            case 'patientConfig':
                return await patientConfigService.patientConfig();
            case 'encounterConfig':
                return await encounterConfig();
            case 'patientAttributesConfig':
                return await patientAttributesConfigService.patientAttributesConfig();
            case 'identifierTypesConfig':
                return await identifierTypesConfig();
            case 'genderMap':
                return await fetchGenderMap();
            case 'addressLevels':
                return await addressLevelsService.addressLevels();
            case 'relationshipTypeConfig':
                return await relationshipTypeConfig();
            case 'relationshipTypeMap':
                return await relationshipTypeMapService.relationshipTypeMap();
            case 'loginLocationToVisitTypeMapping':
                return await loginLocationToVisitTypeMapping();
            case 'defaultEncounterType':
                return await defaultEncounterType();
            case 'helpDeskNumber':
                return await getHelpDeskNumber();
            case 'prescriptionEmailToggle':
                return await getPrescriptionEmailToggle();
            case 'quickLogoutComboKey':
                return await quickLogoutComboKey();
            case 'contextCookieExpirationTimeInMinutes':
                return await getContextCookieExpirationTimeInMinutes();
            case 'enableAuditLog':
                return await enableAuditLog();
            default:
                throw new Error(`Unknown config name: ${configName}`);
        }
    }

    dosageInstructionConfig() {
        return this.configs.dosageInstructionConfig || [];
    }

    stoppedOrderReasonConfig() {
        return this.configs.stoppedOrderReasonConfig || [];
    }

    dosageFrequencyConfig() {
        return this.configs.dosageFrequencyConfig || [];
    }

    allTestsAndPanelsConcept() {
        return this.configs.allTestsAndPanelsConcept?.results?.[0] || [];
    }

    impressionConcept() {
        return this.configs.radiologyImpressionConfig?.results?.[0] || [];
    }

    labOrderNotesConcept() {
        return this.configs.labOrderNotesConfig?.results?.[0] || [];
    }

    consultationNoteConcept() {
        return this.configs.consultationNoteConfig?.results?.[0] || [];
    }

    patientConfig() {
        return this.configs.patientConfig || {};
    }

    encounterConfig() {
        return { ...new EncounterConfig(), ...this.configs.encounterConfig || [] };
    }

    patientAttributesConfig() {
        return this.configs.patientAttributesConfig?.results;
    }

    identifierTypesConfig() {
        return this.configs.identifierTypesConfig;
    }

    genderMap() {
        return this.configs.genderMap;
    }

    addressLevels() {
        return this.configs.addressLevels;
    }

    relationshipTypes() {
        return this.configs.relationshipTypeConfig?.results || [];
    }

    relationshipTypeMap() {
        return this.configs.relationshipTypeMap || {};
    }

    loginLocationToVisitTypeMapping() {
        return this.configs.loginLocationToVisitTypeMapping || {};
    }

    defaultEncounterType() {
        return this.configs.defaultEncounterType;
    }

    helpDeskNumber() {
        return this.configs.helpDeskNumber;
    }

    prescriptionEmailToggle() {
        return this.configs.prescriptionEmailToggle;
    }

    quickLogoutComboKey() {
        return this.configs.quickLogoutComboKey;
    }

    contextCookieExpirationTimeInMinutes() {
        return this.configs.contextCookieExpirationTimeInMinutes;
    }
}

export const configurations = new ConfigurationsService();

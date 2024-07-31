import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import _ from 'lodash';
import { ConceptSetService, ClinicalAppConfigService, MessagingService, Configurations, FormService } from '../services';
import { BahmniContext } from '../context/BahmniContext';

const ConceptSetPageController: React.FC = () => {
    const { conceptSetGroupName, programUuid } = useParams();
    const { consultation, patient, currentUser, currentProvider } = useContext(BahmniContext);

    const [allTemplates, setAllTemplates] = useState([]);
    const [uniqueTemplates, setUniqueTemplates] = useState([]);
    const [scrollingEnabled, setScrollingEnabled] = useState(false);
    const [showTemplatesList, setShowTemplatesList] = useState(false);

    const extensions = ClinicalAppConfigService.getAllConceptSetExtensions(conceptSetGroupName);
    const configs = ClinicalAppConfigService.getAllConceptsConfig();
    const visitType = Configurations.encounterConfig().getVisitTypeByUuid(consultation.visitTypeUuid);
    const context = { visitType, patient };
    const numberOfLevels = 2;
    const fields = ['uuid', 'name:(name,display)', 'names:(uuid,conceptNameType,name)'];
    const customRepresentation = Bahmni.ConceptSet.CustomRepresentationBuilder.build(fields, 'setMembers', numberOfLevels);
    const allConceptSections = [];

    useEffect(() => {
        const init = async () => {
            if (!(allTemplates !== undefined && allTemplates.length > 0)) {
                try {
                    const response = await ConceptSetService.getConcept({
                        name: "All Observation Templates",
                        v: "custom:" + customRepresentation
                    });
                    const allTemplates = response.data.results[0].setMembers;
                    createConceptSections(allTemplates);
                    if (programUuid) {
                        showOnlyTemplatesFilledInProgram();
                    }

                    if (!(consultation.observationForms !== undefined && consultation.observationForms.length > 0)) {
                        const formResponse = await FormService.getFormList(consultation.encounterUuid);
                        consultation.observationForms = getObservationForms(formResponse.data);
                        concatObservationForms();
                    } else {
                        concatObservationForms();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        init();
    }, []);

    const concatObservationForms = () => {
        setAllTemplates(getSelectedObsTemplate(allConceptSections));
        setUniqueTemplates(_.uniqBy(allTemplates, 'label'));
        setAllTemplates(allTemplates.concat(consultation.observationForms));
        if (consultation.selectedObsTemplate.length === 0) {
            initializeDefaultTemplates();
            if (consultation.observations && consultation.observations.length > 0) {
                addTemplatesInSavedOrder();
            }
            const templateToBeOpened = getLastVisitedTemplate() || _.first(consultation.selectedObsTemplate);
            if (templateToBeOpened) {
                openTemplate(templateToBeOpened);
            }
        }
    };

    const addTemplatesInSavedOrder = () => {
        const templatePreference = JSON.parse(localStorage.getItem("templatePreference"));
        if (templatePreference && templatePreference.patientUuid === patient.uuid &&
            !_.isEmpty(templatePreference.templates) && currentProvider.uuid === templatePreference.providerUuid) {
            insertInSavedOrder(templatePreference);
        } else {
            insertInDefaultOrder();
        }
    };

    const insertInSavedOrder = (templatePreference) => {
        const templateNames = templatePreference.templates;
        _.each(templateNames, (templateName) => {
            const foundTemplates = _.filter(allTemplates, (allTemplate) => {
                return allTemplate.conceptName === templateName;
            });
            if (foundTemplates.length > 0) {
                _.each(foundTemplates, (template) => {
                    if (!_.isEmpty(template.observations)) {
                        insertTemplate(template);
                    }
                });
            }
        });
    };

    const insertInDefaultOrder = () => {
        _.each(allTemplates, (template) => {
            if (template.observations.length > 0) {
                insertTemplate(template);
            }
        });
    };

    const insertTemplate = (template) => {
        if (template && !(template.isDefault() || template.alwaysShow)) {
            consultation.selectedObsTemplate.push(template);
        }
    };

    const getLastVisitedTemplate = () => {
        return _.find(consultation.selectedObsTemplate, (template) => {
            return template.id === consultation.lastvisited;
        });
    };

    const openTemplate = (template) => {
        template.isOpen = true;
        template.isLoaded = true;
        template.klass = "active";
    };

    const initializeDefaultTemplates = () => {
        consultation.selectedObsTemplate = _.filter(allTemplates, (template) => {
            return template.isDefault() || template.alwaysShow;
        });
    };

    const filterTemplates = () => {
        setUniqueTemplates(_.uniqBy(allTemplates, 'label'));
        if (consultation.searchParameter) {
            setUniqueTemplates(_.filter(uniqueTemplates, (template) => {
                return _.includes(template.label.toLowerCase(), consultation.searchParameter.toLowerCase());
            }));
        }
        return uniqueTemplates;
    };

    const showOnlyTemplatesFilledInProgram = async () => {
        try {
            const data = await ConceptSetService.getObsTemplatesForProgram(programUuid);
            if (data.results.length > 0 && data.results[0].mappings.length > 0) {
                _.map(allConceptSections, (conceptSection) => {
                    conceptSection.isAdded = false;
                    conceptSection.alwaysShow = false;
                });

                _.map(data.results[0].mappings, (template) => {
                    const matchedTemplate = _.find(allConceptSections, { uuid: template.uuid });
                    if (matchedTemplate) {
                        matchedTemplate.alwaysShow = true;
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const createConceptSections = (allTemplates) => {
        _.map(allTemplates, (template) => {
            const conceptSetExtension = _.find(extensions, (extension) => {
                return extension.extensionParams.conceptName === template.name.name;
            }) || {};
            const conceptSetConfig = configs[template.name.name] || {};
            const observationsForTemplate = getObservationsForTemplate(template);
            if (observationsForTemplate && observationsForTemplate.length > 0) {
                _.each(observationsForTemplate, (observation) => {
                    allConceptSections.push(new Bahmni.ConceptSet.ConceptSetSection(conceptSetExtension, currentUser, conceptSetConfig, [observation], template));
                });
            } else {
                allConceptSections.push(new Bahmni.ConceptSet.ConceptSetSection(conceptSetExtension, currentUser, conceptSetConfig, [], template));
            }
        });
    };

    const collectObservationsFromConceptSets = () => {
        consultation.observations = [];
        _.each(consultation.selectedObsTemplate, (conceptSetSection) => {
            if (conceptSetSection.observations[0]) {
                consultation.observations.push(conceptSetSection.observations[0]);
            }
        });
    };

    const getObservationsForTemplate = (template) => {
        return _.filter(consultation.observations, (observation) => {
            return !observation.formFieldPath && observation.concept.uuid === template.uuid;
        });
    };

    const getSelectedObsTemplate = (allConceptSections) => {
        return allConceptSections.filter((conceptSet) => {
            if (conceptSet.isAvailable(context)) {
                return true;
            }
        });
    };

    const stopAutoClose = (event) => {
        event.stopPropagation();
    };

    const addTemplate = (template) => {
        setScrollingEnabled(true);
        setShowTemplatesList(false);
        const index = _.findLastIndex(consultation.selectedObsTemplate, (consultationTemplate) => {
            return consultationTemplate.label === template.label;
        });

        if (index !== -1 && consultation.selectedObsTemplate[index].allowAddMore) {
            const clonedObj = template.clone();
            clonedObj.klass = "active";
            consultation.selectedObsTemplate.splice(index + 1, 0, clonedObj);
        } else {
            template.toggle();
            template.klass = "active";
            if (index > -1) {
                consultation.selectedObsTemplate[index] = template;
            } else {
                consultation.selectedObsTemplate.push(template);
            }
        }
        consultation.searchParameter = "";
        MessagingService.showMessage("info", `Template ${template.label} added successfully`);
    };

    const getNormalized = (conceptName) => {
        return conceptName.replace(/['\.\s\(\)\/,\\]+/g, "_");
    };

    useEffect(() => {
        consultation.preSaveHandler.register("collectObservationsFromConceptSets", collectObservationsFromConceptSets);
    }, []);

    return (
        <div>
            {/* SECOND AGENT: [MISSING CONTEXT] - Add the JSX structure for the component here */}
        </div>
    );
};

export default ConceptSetPageController;

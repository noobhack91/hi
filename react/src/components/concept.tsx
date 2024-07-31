import React, { useState, useEffect } from 'react';
import moment from 'moment';
import useMessagingService from '../services/messagingService';
import { useTranslation } from 'react-i18next';

interface ConceptProps {
    conceptSetName: string;
    observation: any;
    atLeastOneValueIsSet: boolean;
    showTitle: boolean;
    conceptSetRequired: boolean;
    rootObservation: any;
    patient: any;
    collapseInnerSections: any;
    rootConcept: () => void;
    hideAbnormalButton: boolean;
}

const Concept: React.FC<ConceptProps> = ({
    conceptSetName,
    observation,
    atLeastOneValueIsSet,
    showTitle,
    conceptSetRequired,
    rootObservation,
    patient,
    collapseInnerSections,
    rootConcept,
    hideAbnormalButton
}) => {
    const [collapse, setCollapse] = useState(false);
    const { showMessage } = useMessagingService();
    const { t } = useTranslation();

    useEffect(() => {
        setCollapse(collapseInnerSections && collapseInnerSections.value);
    }, [collapseInnerSections]);

    const cloneNew = (observation: any, parentObservation: any) => {
        observation.showAddMoreButton = () => false;
        const newObs = observation.cloneNew();
        newObs.scrollToElement = true;
        const index = parentObservation.groupMembers.indexOf(observation);
        parentObservation.groupMembers.splice(index + 1, 0, newObs);
        showMessage("info", `${t("NEW_KEY")} ${observation.label} ${t("SECTION_ADDED_KEY")}`);

        const event = new CustomEvent("event:addMore", { detail: newObs });
        window.dispatchEvent(event);
    };

    const removeClonedObs = (observation: any, parentObservation: any) => {
        observation.voided = true;
        const lastObservationByLabel = parentObservation.groupMembers.findLast((groupMember: any) => {
            return groupMember.label === observation.label && !groupMember.voided;
        });

        if (lastObservationByLabel) {
            lastObservationByLabel.showAddMoreButton = () => true;
        }
        observation.hidden = true;
    };

    const isClone = (observation: any, parentObservation: any) => {
        if (parentObservation && parentObservation.groupMembers) {
            const index = parentObservation.groupMembers.indexOf(observation);
            return index > 0 ? parentObservation.groupMembers[index].label === parentObservation.groupMembers[index - 1].label : false;
        }
        return false;
    };

    const isRemoveValid = (observation: any) => {
        if (observation.getControlType() === 'image') {
            return !observation.value;
        }
        return true;
    };

    const getStringValue = (observations: any[]) => {
        return observations.map(observation => {
            return `${observation.value} (${moment(observation.date).format('YYYY-MM-DD')})`;
        }).join(", ");
    };

    const toggleSection = () => {
        setCollapse(!collapse);
    };

    const isCollapsibleSet = () => {
        return showTitle === true;
    };

    const hasPDFAsValue = () => {
        return observation.value && observation.value.indexOf(".pdf") > 0;
    };

        const event = new CustomEvent(`event:observationUpdated-${conceptSetName}`, {
            detail: {
                conceptName: observation.concept.name,
                rootObservation: rootObservation
            }
        });
        window.dispatchEvent(event);
    };
    const handleUpdate = () => {

        const event = new CustomEvent(`event:observationUpdated-${conceptSetName}`, {
            detail: {
                conceptName: observation.concept.name,
                rootObservation: rootObservation
            }
        });
        window.dispatchEvent(event);
    };

    const update = (value: any) => {
        if (getBooleanResult(observation.isObservationNode)) {
            observation.primaryObs.value = value;
        } else if (getBooleanResult(observation.isFormElement())) {
            observation.value = value;
        }
        handleUpdate();
    };

    const getBooleanResult = (value: any) => {
        return !!value;
    };

    const translatedLabel = (observation: any) => {
        if (observation && observation.concept) {
            const currentLocale = 'en'; // SECOND AGENT: [MISSING CONTEXT] - Current user locale
            const conceptNames = observation.concept.names ? observation.concept.names : [];
            const shortName = conceptNames.find((cn: any) => {
                return cn.locale === currentLocale && cn.conceptNameType === "SHORT";
            });

            if (shortName) {
                return shortName.name;
            }

            const fsName = conceptNames.find((cn: any) => {
                return cn.locale === currentLocale && cn.conceptNameType === "FULLY_SPECIFIED";
            });

            if (fsName) {
                return fsName.name;
            }

            return observation.concept.shortName || observation.concept.name;
        }
        if (observation) {
            return observation.label;
        }
        return "UNKNOWN_OBSERVATION_CONCEPT";
    };

    return (
        <div>
            {/* SECOND AGENT: [MISSING CONTEXT] - Add JSX template for the component */}
        </div>
    );
};

export default Concept;

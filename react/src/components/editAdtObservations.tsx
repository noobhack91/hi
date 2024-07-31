import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchObservations, createEncounter } from '../services/observationsService';
import { getConceptSetByConceptName, constructObservationTemplate } from '../services/conceptSetService';
import { getLoginLocationUuid } from '../services/sessionService';
import { showMessage } from '../services/messagingService';
import { ObservationMapper } from '../utils/observationMapper';
import { Spinner } from 'react-bootstrap';

interface EditAdtObservationsProps {
    patient: any;
    conceptSetName: string;
    visitTypeUuid: string;
}

const EditAdtObservations: React.FC<EditAdtObservationsProps> = ({ patient, conceptSetName, visitTypeUuid }) => {
    const [observations, setObservations] = useState<any[]>([]);
    const [savedObservations, setSavedObservations] = useState<any>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [promiseResolved, setPromiseResolved] = useState<boolean>(false);
    const encounterConfig = useSelector((state: any) => state.encounterConfig);

    const assignBedsPrivilege = 'Assign Beds Privilege'; // Replace with actual constant if available

    const getEncounterDataFor = (obs: any, encounterTypeUuid: string, visitTypeUuid: string) => {
        return {
            patientUuid: patient.uuid,
            encounterTypeUuid,
            visitTypeUuid,
            observations: [...obs],
            locationUuid: getLoginLocationUuid()
        };
    };

    const toggleDisabledObservation = (editMode: boolean) => {
        setEditMode(editMode);
        observations[0].groupMembers.forEach((member: any) => {
            member.disabled = !editMode;
        });
    };

    const getNonEmptyObservations = () => {
        const obsCopy = { ...observations[0] };
        obsCopy.groupMembers = obsCopy.groupMembers.filter((member: any) => member.value);
        if (obsCopy.groupMembers.length === 0) {
            showMessage("error", "DATE_OF_DISCHARGE_AND_REASON_FOR_DISCHARGE_CANNOT_BE_EMPTY_MESSAGE");
            setValuesForObservations(savedObservations);
            return [];
        }
        return [obsCopy];
    };

    const edit = () => {
        setSavedObservations({ ...observations[0] });
        toggleDisabledObservation(true);
    };

    const save = async () => {
        toggleDisabledObservation(false);
        const nonEmptyObservations = getNonEmptyObservations();
        if (visitTypeUuid && nonEmptyObservations.length > 0) {
            const encounterData = getEncounterDataFor(nonEmptyObservations, encounterConfig.getConsultationEncounterTypeUuid(), visitTypeUuid);
            await createEncounter(encounterData);
            toggleDisabledObservation(false);
        }
    };

    const cancel = () => {
        setValuesForObservations(savedObservations);
        toggleDisabledObservation(false);
    };

    const resetObservationValues = () => {
        observations[0].groupMembers.forEach((member: any) => {
            member.value = undefined;
        });
    };

    const fetchLatestObsFor = async (conceptNames: string[]) => {
        const response = await fetchObservations(patient.uuid, conceptNames, "latest");
        resetObservationValues();
        toggleDisabledObservation(false);
        if (response.data.length) {
            setValuesForObservations(response.data[0]);
        }
    };

    useEffect(() => {
        if (patient) {
            fetchLatestObsFor([conceptSetName]);
        }
    }, [patient]);

    const setValuesForObservations = (obsGroup: any) => {
        observations[0].value = obsGroup.value;
        obsGroup.groupMembers.forEach((obsGroupMember: any) => {
            observations[0].groupMembers.forEach((member: any) => {
                if (member.concept.uuid === obsGroupMember.concept.uuid) {
                    member.value = obsGroupMember.value;
                    member.disabled = true;
                }
            });
        });
    };

    const init = async () => {
        setPromiseResolved(false);
        const observationMapper = new ObservationMapper();
        const observationTemplate = await constructObservationTemplate(conceptSetName);
        const observation = observationMapper.map([], observationTemplate, {});
        setObservations([observation]);
        toggleDisabledObservation(false);
        setPromiseResolved(true);
        if (patient) {
            const response = await fetchObservations(patient.uuid, [conceptSetName], "latest", 1);
            if (response.data.length) {
                setValuesForObservations(response.data[0]);
            }
        }
    };

    useEffect(() => {
        init();
    }, []);

    if (!promiseResolved) {
        return <Spinner animation="border" />;
    }

    return (
        <div>
            {/* Render observations here */}
            <button onClick={edit}>Edit</button>
            <button onClick={save}>Save</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    );
};

export default EditAdtObservations;

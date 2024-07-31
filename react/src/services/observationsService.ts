﻿import axios from 'axios';
import { formatDateToServerFormat } from '../utils/dateUtil';
import { observationsUrl, obsRelationshipUrl } from '../utils/constants';

interface FetchParams {
    concept: string[];
    obsIgnoreList?: string[];
    filterObsWithOrders?: boolean;
    visitUuid?: string;
    scope?: string;
    patientUuid?: string;
    numberOfVisits?: number;
    patientProgramUuid?: string;
}

interface FlowSheetParams {
    patientUuid: string;
    conceptSet: string;
    groupByConcept: string;
    orderByConcept: string;
    conceptNames: string[];
    numberOfVisits: number;
    initialCount: number;
    latestCount: number;
    groovyExtension: string;
    startDate: string;
    endDate: string;
    patientProgramUuid: string;
    formNames: string[];
}

class ObservationsService {
    fetch(patientUuid: string, conceptNames: string[], scope: string, numberOfVisits: number, visitUuid?: string, obsIgnoreList?: string[], filterObsWithOrders?: boolean, patientProgramUuid?: string) {
        const params: FetchParams = { concept: conceptNames };
        if (obsIgnoreList) {
            params.obsIgnoreList = obsIgnoreList;
        }
        if (filterObsWithOrders != null) {
            params.filterObsWithOrders = filterObsWithOrders;
        }
        if (visitUuid) {
            params.visitUuid = visitUuid;
            params.scope = scope;
        } else {
            params.patientUuid = patientUuid;
            params.numberOfVisits = numberOfVisits;
            params.scope = scope;
            params.patientProgramUuid = patientProgramUuid;
        }
        return axios.get(observationsUrl, {
            params: params,
            withCredentials: true
        });
    }

    getByUuid(observationUuid: string) {
        return axios.get(observationsUrl, {
            params: { observationUuid: observationUuid },
            withCredentials: true
        });
    }

    getRevisedObsByUuid(observationUuid: string) {
        return axios.get(observationsUrl, {
            params: { observationUuid: observationUuid, revision: "latest" },
            withCredentials: true
        });
    }

    fetchForEncounter(encounterUuid: string, conceptNames: string[]) {
        return axios.get(observationsUrl, {
            params: { encounterUuid: encounterUuid, concept: conceptNames },
            withCredentials: true
        });
    }

    fetchForPatientProgram(patientProgramUuid: string, conceptNames: string[], scope: string, obsIgnoreList?: string[]) {
        return axios.get(observationsUrl, {
            params: { patientProgramUuid: patientProgramUuid, concept: conceptNames, scope: scope, obsIgnoreList: obsIgnoreList },
            withCredentials: true
        });
    }

    getObsRelationship(targetObsUuid: string) {
        return axios.get(obsRelationshipUrl, {
            params: { targetObsUuid: targetObsUuid },
            withCredentials: true
        });
    }

    getObsInFlowSheet(patientUuid: string, conceptSet: string, groupByConcept: string, orderByConcept: string, conceptNames: string[], numberOfVisits: number, initialCount: number, latestCount: number, groovyExtension: string, startDate: string, endDate: string, patientProgramUuid: string, formNames: string[]) {
        const params: FlowSheetParams = {
            patientUuid: patientUuid,
            conceptSet: conceptSet,
            groupByConcept: groupByConcept,
            orderByConcept: orderByConcept,
            conceptNames: conceptNames,
            numberOfVisits: numberOfVisits,
            initialCount: initialCount,
            latestCount: latestCount,
            groovyExtension: groovyExtension,
            startDate: formatDateToServerFormat(startDate),
            endDate: formatDateToServerFormat(endDate),
            patientProgramUuid: patientProgramUuid,
            formNames: formNames
        };
        return axios.get(`${observationsUrl}/flowSheet`, {
            params: params,
            withCredentials: true
        });
    }
}

export default new ObservationsService();

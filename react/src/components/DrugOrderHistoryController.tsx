import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';
import { getPrescribedDrugOrders, getMedicationSchedulesForOrders, printSelectedPrescriptions, getOrderedProviderAttributesForPrint } from '../services/treatmentService';
import { getAttributesForProvider } from '../services/providerService';
import { getPatientDiagnosis } from '../services/diagnosisService';
import { fetchObservations } from '../services/observationsService';
import { fetchAndProcessAllergies } from '../services/allergyService';
import { DateUtil } from '../utils/DateUtil';
import { BahmniDate } from '../components/BahmniDate';
import { DrugOrderViewModel } from '../models/DrugOrderViewModel';
import { Constants } from '../utils/constants';

const DrugOrderHistoryController: React.FC = () => {
    const { t } = useTranslation();
    const [dispensePrivilege, setDispensePrivilege] = useState(Constants.dispensePrivilege);
    const [scheduledDate, setScheduledDate] = useState(DateUtil.getDateWithoutTime(DateUtil.addDays(DateUtil.now(), 1)));
    const [allMedicinesInPrescriptionAvailableForIPD, setAllMedicinesInPrescriptionAvailableForIPD] = useState(true);
    const [printPrescriptionFeature, setPrintPrescriptionFeature] = useState(null);
    const [autoSelectNotAllowed, setAutoSelectNotAllowed] = useState(false);
    const [selectedDrugs, setSelectedDrugs] = useState({});
    const [consultation, setConsultation] = useState({ drugOrderGroups: [], activeAndScheduledDrugOrders: [], drugOrdersWithUpdatedOrderAttributes: {} });
    const [medicationSchedules, setMedicationSchedules] = useState([]);
    const [allergies, setAllergies] = useState("");
    const [stoppedOrderReasons, setStoppedOrderReasons] = useState([]);
    const [currentVisit, setCurrentVisit] = useState(null);
    const [prescribedDrugOrders, setPrescribedDrugOrders] = useState([]);

    useEffect(() => {
        const init = async () => {
            const numberOfVisits = 3; // Default value, replace with actual config if available
            const data = await getPrescribedDrugOrders('patientUuid', true, numberOfVisits, 'dateEnrolled', 'dateCompleted');
            setPrescribedDrugOrders(data);
            createPrescriptionGroups(consultation.activeAndScheduledDrugOrders);
        };

        init();
    }, []);

    const createPrescriptionGroups = (activeAndScheduledDrugOrders) => {
        setConsultation(prevState => ({ ...prevState, drugOrderGroups: [] }));
        createPrescribedDrugOrderGroups();
        createRecentDrugOrderGroup(activeAndScheduledDrugOrders);
    };

    const getPreviousVisitDrugOrders = () => {
        const currentVisitIndex = consultation.drugOrderGroups.findIndex(group => group.isCurrentVisit);
        if (consultation.drugOrderGroups[currentVisitIndex + 1]) {
            return consultation.drugOrderGroups[currentVisitIndex + 1].drugOrders;
        }
        return [];
    };

    const sortOrderSetDrugsFollowedByDrugOrders = (drugOrders, showOnlyActive) => {
        const orderSetOrdersAndDrugOrders = _.groupBy(drugOrders, drugOrder => drugOrder.orderGroupUuid ? 'orderSetOrders' : 'drugOrders');
        const refillableDrugOrders = drugOrderHistoryHelper.getRefillableDrugOrders(orderSetOrdersAndDrugOrders.drugOrders, getPreviousVisitDrugOrders(), showOnlyActive);
        return _.concat(orderSetOrdersAndDrugOrders.orderSetOrders, refillableDrugOrders).filter(_.identity).uniqBy('uuid').value();
    };

    const createRecentDrugOrderGroup = (activeAndScheduledDrugOrders) => {
        const showOnlyActive = true; // Replace with actual config if available
        const refillableGroup = {
            label: t("MEDICATION_RECENT_TAB"),
            selected: true,
            drugOrders: sortOrderSetDrugsFollowedByDrugOrders(activeAndScheduledDrugOrders, showOnlyActive)
        };
        setConsultation(prevState => ({ ...prevState, drugOrderGroups: [refillableGroup, ...prevState.drugOrderGroups] }));
    };

    const createPrescribedDrugOrderGroups = () => {
        if (prescribedDrugOrders.length === 0) {
            return [];
        }
        const drugOrderGroupedByDate = _.groupBy(prescribedDrugOrders, drugOrder => DateUtil.parse(drugOrder.visit.startDateTime));
        const createDrugOrder = drugOrder => DrugOrderViewModel.createFromContract(drugOrder, treatmentConfig);
        const drugOrderGroups = _.map(drugOrderGroupedByDate, (drugOrders, visitStartDate) => ({
            label: BahmniDate(visitStartDate),
            visitStartDate: DateUtil.parse(visitStartDate),
            drugOrders: drugOrders.map(createDrugOrder),
            isCurrentVisit: currentVisit && DateUtil.isSameDateTime(visitStartDate, currentVisit.startDatetime)
        }));
        setConsultation(prevState => ({
            ...prevState,
            drugOrderGroups: _.sortBy([...prevState.drugOrderGroups, ...drugOrderGroups], 'visitStartDate').reverse()
        }));
    };

    const printSelectedDrugs = async () => {
        const drugOrdersForPrint = [];
        const promises = [];
        let diagnosesCodes = "";
        let dispenserInfo = [];
        let observationsEntries = [];

        for (const [drugOrderIndex, selected] of Object.entries(selectedDrugs)) {
            if (selected) {
                const [groupIndex, drugOrderUuid] = drugOrderIndex.split("/");
                const drugOrder = consultation.drugOrderGroups[groupIndex].drugOrders.find(order => order.uuid === drugOrderUuid);
                if (drugOrder) {
                    if (printPrescriptionFeature?.providerAttributesForPrint?.length > 0) {
                        drugOrder.provider.attributes = {};
                        const promise = getAttributesForProvider(drugOrder.provider.uuid);
                        promises.push(promise);
                        promise.then(response => {
                            drugOrder.provider.attributes = getOrderedProviderAttributesForPrint(response.data.results, printPrescriptionFeature.providerAttributesForPrint);
                        }).catch(error => {
                            console.error("Error fetching provider attributes: ", error);
                        });
                    }
                    drugOrdersForPrint.push(drugOrder);
                }
            }
        }

        if (printPrescriptionFeature?.providerAttributesForPrint?.length > 0) {
            const promise = Promise.all([
                getPatientDiagnosis('patientUuid'),
                getAttributesForProvider('currentProviderUuid'),
                fetchObservations('patientUuid', printPrescriptionFeature.observationsConcepts, "latest")
            ]).then(([diagnoses, dispenserAttributes, observations]) => {
                observationsEntries = observations.data;
                dispenserInfo = getOrderedProviderAttributesForPrint(dispenserAttributes.data.results, printPrescriptionFeature.providerAttributesForPrint);
                diagnoses.data.forEach(diagnosis => {
                    if (diagnosis.order === printPrescriptionFeature.printDiagnosis.order &&
                        diagnosis.certainty === printPrescriptionFeature.printDiagnosis.certainity) {
                        if (diagnosesCodes.length > 0) {
                            diagnosesCodes += ", ";
                        }
                        if (diagnosis.codedAnswer?.mappings.length !== 0) {
                            diagnosesCodes += `${diagnosis.codedAnswer.mappings[0].code} - ${diagnosis.codedAnswer.name}`;
                        } else if (diagnosis.codedAnswer) {
                            diagnosesCodes += diagnosis.codedAnswer.name;
                        } else if (diagnosis.freeTextAnswer) {
                            diagnosesCodes += diagnosis.freeTextAnswer;
                        }
                    }
                });
            });
            promises.push(promise);
        }

        const allergyPromise = fetchAndProcessAllergies('patientUuid').then(allergies => {
            setAllergies(allergies);
        });
        promises.push(allergyPromise);

        Promise.all(promises).then(() => {
            const additionalInfo = {
                visitType: currentVisit ? currentVisit.visitType.display : "",
                currentDate: new Date(),
                facilityLocation: 'facilityLocation' // Replace with actual facility location
            };
            printSelectedPrescriptions(printPrescriptionFeature, drugOrdersForPrint, 'patient', additionalInfo, diagnosesCodes, dispenserInfo, observationsEntries, allergies, currentVisit.startDatetime);
            setSelectedDrugs({});
        }).catch(error => {
            console.error("Error fetching details for print: ", error);
        });
    };

    return (
        <div>
            {/* SECOND AGENT: [MISSING CONTEXT] - Add the JSX structure and elements here */}
        </div>
    );
};

export default DrugOrderHistoryController;

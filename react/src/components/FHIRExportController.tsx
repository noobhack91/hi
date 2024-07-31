import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import messagingService from '../services/messagingService';
import fhirExportService from '../services/fhirExportService';
import { Bahmni } from '../utils/constants/Bahmni';
import DateUtil from '../utils/DateUtil';

const FHIRExportController: React.FC = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date>(subtractDaysFromToday(30));
    const [endDate, setEndDate] = useState<Date>(subtractDaysFromToday(0));
    const [anonymise, setAnonymise] = useState<boolean>(true);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState<boolean>(false);
    const [hasExportPrivileges, setHasExportPrivileges] = useState<boolean>(false);
    const [tasks, setTasks] = useState<any[]>([]);
    const [uuid, setUuid] = useState<string | null>(null);

    useEffect(() => {
        setIsCheckboxDisabled(hasInsufficientPrivilegeForPlainExport());
        setHasExportPrivileges(isUserPrivilegedForFhirExport());
        loadFhirTasksForPrivilegedUsers();
    }, []);

    const convertToLocalDate = (date: string) => {
        const localDate = DateUtil.parseLongDateToServerFormat(date);
        return DateUtil.getDateTimeInSpecifiedFormat(localDate, 'MMMM Do, YYYY [at] h:mm:ss A');
    };

    const subtractDaysFromToday = (minusDays: number) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - minusDays);
        return currentDate;
    };

    const isLoggedInUserPrivileged = (expectedPrivileges: string[]) => {
        const currentPrivileges = Bahmni.Common.Util.getCurrentUserPrivileges();
        return expectedPrivileges.some(privilege => currentPrivileges.includes(privilege));
    };

    const hasInsufficientPrivilegeForPlainExport = () => {
        const plainExportPrivileges = [Bahmni.Common.Constants.plainFhirExportPrivilege];
        return !isLoggedInUserPrivileged(plainExportPrivileges);
    };

    const isUserPrivilegedForFhirExport = () => {
        const defaultExportPrivileges = [Bahmni.Common.Constants.fhirExportPrivilege, Bahmni.Common.Constants.plainFhirExportPrivilege];
        return isLoggedInUserPrivileged(defaultExportPrivileges);
    };

    const loadFhirTasksForPrivilegedUsers = async () => {
        if (isUserPrivilegedForFhirExport()) {
            try {
                const uuidResponse = await fhirExportService.getUuidForAnonymiseConcept();
                setUuid(uuidResponse?.data?.results?.[0]?.uuid || null);

                const tasksResponse = await fhirExportService.loadFhirTasks();
                if (tasksResponse.data && tasksResponse.data.entry) {
                    const fhirExportTasks = tasksResponse.data.entry.filter((task: any) => {
                        return task.resource.basedOn && task.resource.basedOn.some((basedOn: any) => basedOn.reference === uuid);
                    });
                    const formattedTasks = fhirExportTasks.map((task: any) => {
                        task.resource.authoredOn = convertToLocalDate(task.resource.authoredOn);
                        return task;
                    });
                    setTasks(formattedTasks);
                }
            } catch (error) {
                console.error("Error loading FHIR tasks", error);
            }
        }
    };

    const exportFhirData = async () => {
        const startDateFormatted = DateUtil.getDateWithoutTime(startDate);
        const endDateFormatted = DateUtil.getDateWithoutTime(endDate);
        const username = Bahmni.Common.Util.getCurrentUsername();

        try {
            await fhirExportService.export(username, startDateFormatted, endDateFormatted, anonymise);
            await fhirExportService.submitAudit(username, startDateFormatted, endDateFormatted, anonymise);
            messagingService.showMessage("info", t("EXPORT_PATIENT_REQUEST_SUBMITTED"));
            loadFhirTasksForPrivilegedUsers();
        } catch (error) {
            messagingService.showMessage("error", t("EXPORT_PATIENT_REQUEST_SUBMIT_ERROR"));
            console.error("FHIR Export request failed", error);
        }
    };

    const extractAttribute = (array: any[], searchValue: string, attributeToExtract: string) => {
        const foundElement = array.find(inputElement => inputElement.type.text === searchValue);
        return foundElement ? foundElement[attributeToExtract] : null;
    };

    const extractBoolean = (array: any[], searchValue: string, attributeToExtract: string) => {
        const booleanStr = extractAttribute(array, searchValue, attributeToExtract);
        return booleanStr && booleanStr.toLowerCase() === "true";
    };

    return (
        <div>

            <h2>{t("FHIR Export")}</h2>
    
                <label>{t("Start Date")}</label>
                <input
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                />
            </div>
    
                <label>{t("End Date")}</label>
                <input
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                />
            </div>
    
                <label>
                    <input
                        type="checkbox"
                        checked={anonymise}
                        onChange={(e) => setAnonymise(e.target.checked)}
                        disabled={isCheckboxDisabled}
                    />
                    {t("Anonymise")}
                </label>
            </div>
            <button onClick={exportFhirData} disabled={!hasExportPrivileges}>
                {t("Export FHIR Data")}
            </button>
    
                <h3>{t("Tasks")}</h3>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            {task.resource.authoredOn} - {task.resource.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FHIRExportController;

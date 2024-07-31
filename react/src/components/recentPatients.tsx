import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PatientService } from '../services/patientService';
import { SessionService } from '../services/sessionService';
import { ClinicalDashboardConfig } from '../utils/constants/clinicalDashboardConfig';
import { RootContext } from '../context/RootContext';
import _ from 'lodash';

const RecentPatients: React.FC = () => {
    const { currentUser } = useContext(RootContext);
    const history = useHistory();
    const { configName } = useParams<{ configName: string }>();
    const [search, setSearch] = useState(new Bahmni.Common.PatientSearch.Search(undefined));
    const [showPatientsList, setShowPatientsList] = useState(false);
    const [showPatientsBySearch, setShowPatientsBySearch] = useState(false);
    const [recentlyViewedPatients, setRecentlyViewedPatients] = useState([]);
    const [patientIndex, setPatientIndex] = useState(-1);

    useEffect(() => {
        setRecentlyViewedPatients(_.take(currentUser.recentlyViewedPatients, ClinicalDashboardConfig.getMaxRecentlyViewedPatients()));
        const index = _.findIndex(recentlyViewedPatients, (patientHistoryEntry) => {
            return patientHistoryEntry.uuid === search.patient.uuid;
        });
        setPatientIndex(index);
    }, [currentUser, search.patient.uuid, recentlyViewedPatients]);

    const hasNext = () => {
        return patientIndex !== 0;
    };

    const togglePatientsList = () => {
        setShowPatientsList(!showPatientsList);
    };

    const hidePatientsBySearch = () => {
        setShowPatientsBySearch(false);
    };

    const hasPrevious = () => {
        return patientIndex >= 0 && recentlyViewedPatients.length - 1 !== patientIndex;
    };

    const next = () => {
        if (hasNext()) {
            goToDashboard(recentlyViewedPatients[patientIndex - 1].uuid);
        }
    };

    const previous = () => {
        if (hasPrevious()) {
            goToDashboard(recentlyViewedPatients[patientIndex + 1].uuid);
        }
    };

    const goToDashboard = (patientUuid: string) => {
        history.push(`/patient/dashboard/${configName}/${patientUuid}`);
    };

    const clearSearch = () => {
        setSearch({ ...search, searchParameter: '' });
        document.querySelector('.search-input')?.focus();
    };

    const getActivePatients = () => {
        setShowPatientsBySearch(true);
        if (search.patientsCount() > 0) {
            return;
        }
        const params = { q: Bahmni.Clinical.Constants.globalPropertyToFetchActivePatients, location_uuid: SessionService.getLoginLocationUuid() };
        PatientService.findPatients(params).then((response) => {
            search.updatePatientList(response.data);
        });
    };

    return (
        <div>

            <button onClick={togglePatientsList}>
                {showPatientsList ? 'Hide Patients List' : 'Show Patients List'}
            </button>
            {showPatientsList && (
                <ul>
                    {recentlyViewedPatients.map((patient, index) => (
                        <li key={patient.uuid}>
                            <button onClick={() => goToDashboard(patient.uuid)}>
                                {patient.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={previous} disabled={!hasPrevious()}>
                Previous
            </button>
            <button onClick={next} disabled={!hasNext()}>
                Next
            </button>
            <button onClick={clearSearch}>
                Clear Search
            </button>
            <button onClick={getActivePatients}>
                Get Active Patients
            </button>
            {showPatientsBySearch && (
        
                    {/* Render search results here */}
                    {search.patients.map((patient) => (
                        <div key={patient.uuid}>
                            {patient.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentPatients;

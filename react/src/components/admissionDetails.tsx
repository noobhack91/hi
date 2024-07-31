import React, { useState, useEffect, useContext } from 'react';
import BedService from '../services/bedService';
import { BedDetailsContext } from '../context/BedDetailsContext';

interface AdmissionDetailsProps {
    params: any;
    patientUuid: string;
    visitSummary: any;
}

const AdmissionDetails: React.FC<AdmissionDetailsProps> = ({ params, patientUuid, visitSummary }) => {
    const [bedDetails, setBedDetails] = useState<any>(null);
    const { setBedDetails: setGlobalBedDetails } = useContext(BedDetailsContext);

    useEffect(() => {
        const fetchBedDetails = async () => {
            if (patientUuid && visitSummary) {
                const visitUuid = visitSummary.uuid;
                const details = await BedService.getAssignedBedForPatient(patientUuid, visitUuid);
                setBedDetails(details);
                setGlobalBedDetails(details);
            }
        };

        fetchBedDetails();
    }, [patientUuid, visitSummary, setGlobalBedDetails]);

    const showDetailsButton = (encounter: any) => {
        return params && params.showDetailsButton && !encounter.notes;
    };

    const toggle = (element: any) => {
        element.show = !element.show;
    };

    const calculateDaysAdmitted = () => {
        if (visitSummary) {
            if (visitSummary.admissionDetails && visitSummary.dischargeDetails) {
                const admissionDate = new Date(visitSummary.admissionDetails.date);
                const dischargeDate = new Date(visitSummary.dischargeDetails.date);
                const timeDifference = dischargeDate.getTime() - admissionDate.getTime();
                const daysAdmitted = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                visitSummary.daysAdmitted = daysAdmitted;
                visitSummary.showDaysAdmitted = true;
            } else {
                visitSummary.showDaysAdmitted = false;
            }
        }
    };

    useEffect(() => {
        calculateDaysAdmitted();
    }, [visitSummary]);

    const isDataPresent = () => {
        if (!visitSummary || (!visitSummary.admissionDetails && !visitSummary.dischargeDetails)) {

            const event = new CustomEvent("no-data-present-event");
            window.dispatchEvent(event);
            return false;
        }
            return false;
        }
        return true;
    };

    return (
        <div>
            {/* SECOND AGENT: [MISSING CONTEXT] - Add the JSX structure for the component based on the original AngularJS template */}
        </div>
    );
};

export default AdmissionDetails;

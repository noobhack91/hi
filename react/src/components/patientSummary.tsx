import React, { useState } from 'react';

interface PatientSummaryProps {
    patient: any; // Replace 'any' with the appropriate type for patient
    bedDetails: any; // Replace 'any' with the appropriate type for bedDetails
    onImageClickHandler?: () => void;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ patient, bedDetails, onImageClickHandler }) => {
    const [showPatientDetails, setShowPatientDetails] = useState(false);

    const togglePatientDetails = () => {
        setShowPatientDetails(!showPatientDetails);
    };

    const handleImageClick = () => {
        if (onImageClickHandler) {
            onImageClickHandler();
        }
    };

    return (
        <div>
            <button onClick={togglePatientDetails}>
                {showPatientDetails ? 'Hide Details' : 'Show Details'}
            </button>
            {showPatientDetails && (
                <div>
                    {/* Render patient details here */}
                    <p>{patient.name}</p>
                    <p>{bedDetails}</p>
                    <img src={patient.image} alt="Patient" onClick={handleImageClick} />
                </div>
            )}
        </div>
    );
};

export default PatientSummary;

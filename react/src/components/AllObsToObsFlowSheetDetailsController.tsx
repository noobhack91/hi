import React from 'react';

interface AllObsToObsFlowSheetDetailsControllerProps {
    patient: any;
    section: any;
}

const AllObsToObsFlowSheetDetailsController: React.FC<AllObsToObsFlowSheetDetailsControllerProps> = ({ patient, section }) => {
    const config = section ? section.expandedViewConfig : {};

    return (
        <div>
            {/* Render the component UI here */}

            <div>
                <h2>Patient Details</h2>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>

                <h3>Section Details</h3>
                {config && (
                    <div>
                        <p><strong>Config Name:</strong> {config.name}</p>
                        <p><strong>Config Description:</strong> {config.description}</p>
                        {/* Add more fields as necessary based on the structure of config */}
                    </div>
                )}
            </div>
    );
};

export default AllObsToObsFlowSheetDetailsController;

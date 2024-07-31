import React from 'react';

interface AllOrdersDetailsControllerProps {
    ngDialogData: {
        patient: any;
        section: {
            title: string;
            expandedViewConfig: any;
        };
    };
}

const AllOrdersDetailsController: React.FC<AllOrdersDetailsControllerProps> = ({ ngDialogData }) => {
    const patient = ngDialogData.patient;
    const section = ngDialogData.section;
    const title = section.title;
    const config = section ? section.expandedViewConfig : {};

    return (
        <div>
            <h1>{title}</h1>

            <div>
                <h2>Patient Details</h2>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                {/* Add more patient details as needed */}
            </div>
            <div>
                <h2>Configuration Details</h2>
                <pre>{JSON.stringify(config, null, 2)}</pre>
                {/* Add more config details as needed */}
            </div>
    );
};

export default AllOrdersDetailsController;

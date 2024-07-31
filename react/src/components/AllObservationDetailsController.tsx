import React from 'react';

interface AllObservationDetailsProps {
    patient: any;
    section: any;
}

const AllObservationDetailsController: React.FC<AllObservationDetailsProps> = ({ patient, section }) => {
    const config = section ? section.expandedViewConfig : {};

    return (
        <div>

            <h2>Patient Details</h2>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>

            <h2>Section Details</h2>
            <p><strong>Title:</strong> {section.title}</p>
            <p><strong>Description:</strong> {section.description}</p>

            <h2>Configuration</h2>
            <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
    );
};

export default AllObservationDetailsController;

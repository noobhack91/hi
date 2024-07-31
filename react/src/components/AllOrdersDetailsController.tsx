import React from 'react';

interface AllOrdersDetailsControllerProps {
    patient: any;
    section: any;
}

const AllOrdersDetailsController: React.FC<AllOrdersDetailsControllerProps> = ({ patient, section }) => {
    const title = section.title;
    const config = section ? section.expandedViewConfig : {};

    return (
        <div>
            <h1>{title}</h1>

            <div>
                <h2>Patient Details</h2>
                <p>Name: {patient.name}</p>
                <p>Age: {patient.age}</p>
                <p>Gender: {patient.gender}</p>
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

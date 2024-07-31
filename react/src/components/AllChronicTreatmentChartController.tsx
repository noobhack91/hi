import React from 'react';

interface AllChronicTreatmentChartControllerProps {
    patient: any;
    enrollment: any;
    section: any;
}

const AllChronicTreatmentChartController: React.FC<AllChronicTreatmentChartControllerProps> = ({ patient, enrollment, section }) => {
    const config = section ? section.expandedViewConfig : {};

    return (
        <div>

            <h2>Chronic Treatment Chart</h2>
    
                <strong>Patient:</strong> {patient.name}
            </div>
    
                <strong>Enrollment:</strong> {enrollment.date}
            </div>
    
                <strong>Configuration:</strong> {JSON.stringify(config)}
            </div>
            {/* Render additional details or charts based on the patient, enrollment, and config data */}
        </div>
    );
};

export default AllChronicTreatmentChartController;

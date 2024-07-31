import React from 'react';
import { useHistory } from 'react-router-dom';

const PatientDashboardProgramsController: React.FC = () => {
    const history = useHistory();

    const gotoDetailsPage = () => {
        history.push('/patient/patientProgram/show');
    };

    return (
        <div>
            <button onClick={gotoDetailsPage}>Go to Details Page</button>
        </div>
    );
};

export default PatientDashboardProgramsController;

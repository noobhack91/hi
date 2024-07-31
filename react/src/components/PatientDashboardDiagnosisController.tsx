import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

interface PatientDashboardDiagnosisControllerProps {
    dashboard: any;
}

const PatientDashboardDiagnosisController: React.FC<PatientDashboardDiagnosisControllerProps> = ({ dashboard }) => {
    const section = dashboard.getSectionByType("diagnosis") || {};

    const [showDialog, setShowDialog] = React.useState(false);

    const openSummaryDialog = () => {
        setShowDialog(true);
    };

    const closeSummaryDialog = () => {
        setShowDialog(false);
    };

    useEffect(() => {
        const handleDialogClose = () => {
            document.body.classList.remove('modal-open');
        };

        if (showDialog) {
            document.body.classList.add('modal-open');
        } else {
            handleDialogClose();
        }

        return () => {
            handleDialogClose();
        };
    }, [showDialog]);

    return (
        <div>
            <button onClick={openSummaryDialog}>Open Summary</button>
            <Modal show={showDialog} onHide={closeSummaryDialog} className="ng-dialog-all-details-page">
                <Modal.Header closeButton>
                    <Modal.Title>Diagnosis Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div>
                        {/* Assuming diagnosisSummary.html contains a list of diagnoses */}
                        {section.diagnoses && section.diagnoses.length > 0 ? (
                            <ul>
                                {section.diagnoses.map((diagnosis: any, index: number) => (
                                    <li key={index}>
                                        <strong>{diagnosis.name}</strong>: {diagnosis.details}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No diagnoses available.</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PatientDashboardDiagnosisController;

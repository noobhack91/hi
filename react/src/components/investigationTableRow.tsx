import React, { useState } from 'react';

interface InvestigationTableRowProps {
    test: any;
    params?: {
        showDetailsButton?: boolean;
    };
}

const InvestigationTableRow: React.FC<InvestigationTableRowProps> = ({ test, params }) => {
    const defaultParams = {
        showDetailsButton: true,
    };

    const mergedParams = { ...defaultParams, ...params };

    const hasNotes = () => {
        return test.notes || test.showNotes ? true : false;
    };

    const getFormattedRange = (test: any) => {
        if (test.minNormal && test.maxNormal) {
            return `(${test.minNormal} - ${test.maxNormal})`;
        } else if (test.minNormal && !test.maxNormal) {
            return `(>${test.minNormal})`;
        } else if (!test.minNormal && test.maxNormal) {
            return `(<${test.maxNormal})`;
        } else {
            return "";
        }
    };

    const getLocaleSpecificNameForPanel = (test: any) => {
        if (test.preferredPanelName != null) {
            return test.preferredPanelName;
        } else {
            if (!test.panelName) {
                return test.orderName;
            } else {
                return test.panelName;
            }
        }
    };

    const getLocaleSpecificNameForTest = (test: any) => {
        if (test.preferredTestName != null) {
            return test.preferredTestName;
        } else {
            return test.testName;
        }
    };

    const showTestNotes = () => {
        return hasNotes();
    };

    const [showDetails, setShowDetails] = useState(false);

    const toggle = () => {
        setShowDetails(!showDetails);
    };

    const isValidResultToShow = (result: any) => {
        if (result != undefined && result != null && result.toLowerCase() !== 'undefined' && result.toLowerCase() !== 'null') {
            return true;
        }
        return false;
    };

    const labReportUrl = test.uploadedFileName ? `${Bahmni.Common.Constants.labResultUploadedFileNameUrl}${test.uploadedFileName}` : null;

    return (
        <div>
            {/* Render the component UI here */}
            <div>
                <button onClick={toggle}>
                    {mergedParams.showDetailsButton ? 'Show Details' : 'Hide Details'}
                </button>
                {showDetails && (
                    <div>
                        {/* Render details here */}
                        <p>{getLocaleSpecificNameForTest(test)}</p>
                        <p>{getFormattedRange(test)}</p>
                        {showTestNotes() && <p>Notes: {test.notes}</p>}
                        {labReportUrl && <a href={labReportUrl}>Lab Report</a>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestigationTableRow;

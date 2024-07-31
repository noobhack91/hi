import React, { useState } from 'react';

interface InvestigationTableRowProps {
    test: any;
    params: any;
}

const InvestigationTableRow: React.FC<InvestigationTableRowProps> = ({ test, params }) => {
    const defaultParams = {
        showDetailsButton: true
    };

    const mergedParams = { ...defaultParams, ...params };

    const urlFrom = (fileName: string) => {
        // SECOND AGENT: [MISSING CONTEXT] - Bahmni.Common.Constants.labResultUploadedFileNameUrl needs to be defined or imported
        return Bahmni.Common.Constants.labResultUploadedFileNameUrl + fileName;
    };

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

    return (
        <div>

    
                <span>{getLocaleSpecificNameForPanel(test)}</span>
                <span>{getLocaleSpecificNameForTest(test)}</span>
                <span>{getFormattedRange(test)}</span>
                {showTestNotes() && <span>{test.notes}</span>}
                {isValidResultToShow(test.result) && <span>{test.result}</span>}
                {test.uploadedFileName && (
                    <a href={urlFrom(test.uploadedFileName)} target="_blank" rel="noopener noreferrer">
                        View Report
                    </a>
                )}
                {mergedParams.showDetailsButton && (
                    <button onClick={toggle}>
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                )}
            </div>
            {showDetails && (
        
                    {/* SECOND AGENT: [MISSING CONTEXT] - Additional details to be displayed when showDetails is true */}
                </div>
            )}
        </div>
    );
};

export default InvestigationTableRow;

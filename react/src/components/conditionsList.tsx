import React, { useState, useEffect } from 'react';
import ngDialog from 'ng-dialog';
import conditionsService from '../services/conditionsService';
import providerInfoService from '../services/providerInfoService';

interface Condition {
    uuid: string;
    concept: any;
    conditionNonCoded: string;
    status: string;
    onSetDate: string | null;
    endDate: string | null;
    endReason: string;
    additionalDetail: string;
    voided: boolean;
    voidReason: string;
}

interface ConditionsListProps {
    params: any;
    patient: { uuid: string };
}

const ConditionsList: React.FC<ConditionsListProps> = ({ params, patient }) => {
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [statuses] = useState(['ACTIVE', 'HISTORY_OF']);

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const fetchedConditions = await conditionsService.getConditions(patient.uuid);
                setConditions(fetchedConditions);
                providerInfoService.setProvider(fetchedConditions);
            } catch (error) {
                console.error('Error fetching conditions:', error);
            }
        };

        fetchConditions();
    }, [patient.uuid]);

    const openSummaryDialog = () => {
        ngDialog.open({
            template: '../common/displaycontrols/conditionsList/views/conditionsList.html',
            className: 'ngdialog-theme-default ng-dialog-all-details-page',
            data: { conditions },
            controller: function ($scope) {
                $scope.hideTitle = true;
                $scope.statuses = ['ACTIVE', 'HISTORY_OF', 'INACTIVE'];
                $scope.conditions = $scope.ngDialogData.conditions;
            }
        });
    };

    return (
        <div>
            <button onClick={openSummaryDialog}>Open Summary</button>

            <div>
                {conditions.length > 0 ? (
                    <ul>
                        {conditions.map((condition) => (
                            <li key={condition.uuid}>
                                <div>
                                    <strong>Status:</strong> {condition.status}
                                </div>
                                <div>
                                    <strong>Condition:</strong> {condition.conditionNonCoded || condition.concept.name}
                                </div>
                                <div>
                                    <strong>Onset Date:</strong> {condition.onSetDate}
                                </div>
                                {condition.endDate && (
                                    <div>
                                        <strong>End Date:</strong> {condition.endDate}
                                    </div>
                                )}
                                {condition.endReason && (
                                    <div>
                                        <strong>End Reason:</strong> {condition.endReason}
                                    </div>
                                )}
                                {condition.additionalDetail && (
                                    <div>
                                        <strong>Additional Detail:</strong> {condition.additionalDetail}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No conditions found.</p>
                )}
            </div>
    );
};

export default ConditionsList;

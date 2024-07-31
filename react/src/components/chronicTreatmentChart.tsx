import React, { useEffect, useState } from 'react';
import { drugService } from '../services/drugService';
import useMessagingService from '../services/messagingService';
import { Spinner } from 'react-bootstrap';

interface ChronicTreatmentChartProps {
    patient: any;
    section: any;
    isOnDashboard: boolean;
    enrollment: string;
}

const ChronicTreatmentChart: React.FC<ChronicTreatmentChartProps> = ({ patient, section, isOnDashboard, enrollment }) => {
    const [regimen, setRegimen] = useState<any>({});
    const { showMessage } = useMessagingService();
    const config = isOnDashboard ? section.dashboardConfig : section.expandedViewConfig;

    useEffect(() => {
        const init = async () => {
            try {
                const data = await drugService.getRegimen(patient.uuid, enrollment, config.drugs);
                const filteredData = filterNullRow(data);
                setRegimen(section.dateSort === "desc" ? { headers: data.headers, rows: filteredData.rows.reverse() } : filteredData);
                if (!filteredData.rows.length) {
                    showMessage('info', "No data present");
                }
            } catch (error) {
                showMessage('error', "Failed to fetch regimen data");
            }
        };

        init();
    }, [patient.uuid, enrollment, config.drugs, section.dateSort, showMessage]);

    const filterNullRow = (data: any) => {
        const filteredRows = data.rows.filter((row: any) => {
            return row.drugs.some((drug: any) => drug);
        });
        return { ...data, rows: filteredRows };
    };

    const getAbbreviation = (concept: any) => {
        let result;

        if (concept && concept.mappings && concept.mappings.length > 0 && section.headingConceptSource) {
            result = concept.mappings.find((mapping: any) => mapping.source === section.headingConceptSource)?.code;
            result = result ? result : concept.shortName || concept.name;
        }

        return result || concept.shortName || concept.name;
    };

    const isMonthNumberRequired = () => {
        return regimen && regimen.rows && regimen.rows[0] && regimen.rows[0].month;
    };

    const isClickable = () => {
        return isOnDashboard && section.expandedViewConfig;
    };

    return (
        <div>
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>

            {regimen && regimen.rows && regimen.rows.length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {regimen.headers.map((header: any, index: number) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {regimen.rows.map((row: any, rowIndex: number) => (
                            <tr key={rowIndex}>
                                {row.drugs.map((drug: any, drugIndex: number) => (
                                    <td key={drugIndex}>
                                        {drug ? getAbbreviation(drug.concept) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No regimen data available</div>
            )}
    );
};

export default ChronicTreatmentChart;

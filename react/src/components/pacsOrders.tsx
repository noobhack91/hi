import React, { useEffect, useState } from 'react';
import PacsService from '../services/pacsService';
import OrderTypeService from '../services/orderTypeService';
import OrderService from '../services/orderService';
import useMessagingService from '../services/messagingService';

interface PacsOrdersProps {
    patient: { uuid: string, identifier: string };
    section: { pacsStudyUrl?: string };
    orderType: string;
    orderUuid?: string;
    config: {
        conceptNames: string[];
        numberOfVisits: number;
        obsIgnoreList?: string[];
        pacsImageUrl?: string;
    };
    visitUuid?: string;
}

const PacsOrders: React.FC<PacsOrdersProps> = ({ patient, section, orderType, orderUuid, config, visitUuid }) => {
    const [orderTypeUuid, setOrderTypeUuid] = useState<string | undefined>(undefined);
    const [bahmniOrders, setBahmniOrders] = useState<any[]>([]);
    const [noOrdersMessage, setNoOrdersMessage] = useState<string | undefined>(undefined);
    const { showMessage } = useMessagingService();

    useEffect(() => {
        const fetchOrderTypeUuid = async () => {
            const uuid = OrderTypeService.getOrderTypeUuid(orderType);
            setOrderTypeUuid(uuid);
        };

        fetchOrderTypeUuid();
    }, [orderType]);

    useEffect(() => {
        const init = async () => {
            try {
                const radiologyOrders = await getOrders();
                const response = await queryPacsStudies();
                correlateWithStudies(radiologyOrders, response);
            } catch (error) {
                console.error("Error occurred while trying to fetch radiology studies", error);
                if (error.response && error.response.status !== 501) {
                    showMessage('error', "RADIOLOGY_STUDY_FETCH_ERROR");
                }
                correlateWithStudies([], []);
            }
        };

        init();
    }, [orderTypeUuid, patient, config, visitUuid, orderUuid]);

    const getOrders = async () => {
        const params = {
            patientUuid: patient.uuid,
            orderTypeUuid: orderTypeUuid,
            conceptNames: config.conceptNames,
            includeObs: true,
            numberOfVisits: config.numberOfVisits,
            obsIgnoreList: config.obsIgnoreList,
            visitUuid: visitUuid,
            orderUuid: orderUuid
        };
        return await OrderService.getOrders(params);
    };

    const queryPacsStudies = async () => {
        return await PacsService.search(patient.identifier);
    };

    const correlateWithStudies = (radiologyOrders: any[], radiologyStudies: any[]) => {
        if (radiologyOrders) {
            radiologyOrders.forEach((ro: any) => {
                ro.pacsImageUrl = (config.pacsImageUrl || "").replace('{{patientID}}', patient.identifier).replace('{{orderNumber}}', ro.orderNumber);
                if (radiologyStudies) {
                    const matchingStudy = radiologyStudies.find((rs: any) => {
                        if (!rs.identifier) {
                            return false;
                        }
                        const matches = rs.identifier.filter((rsi: any) => {
                            return PacsService.getAccessionNumber(rsi) === ro.orderNumber;
                        });
                        return (matches && matches.length > 0);
                    });

                    if (matchingStudy) {
                        ro.studyInstanceUID = matchingStudy.id;
                        ro.pacsStudyUrl = (section.pacsStudyUrl || "/oviyam2/viewer.html?patientID={{patientID}}&studyUID={{studyUID}}")
                            .replace('{{patientID}}', patient.identifier)
                            .replace('{{studyUID}}', matchingStudy.id)
                            .replace('{{accessionNumber}}', ro.orderNumber);
                    }
                }
            });
            setBahmniOrders(radiologyOrders || []);
        } else {
            if (bahmniOrders.length === 0) {
                setNoOrdersMessage(orderType);

                const event = new CustomEvent("no-data-present-event");
                window.dispatchEvent(event);
            }
        }
    };

    const getUrl = (orderNumber: string) => {
        const pacsImageTemplate = config.pacsImageUrl || "";
        return pacsImageTemplate
            .replace('{{patientID}}', patient.identifier)
            .replace('{{orderNumber}}', orderNumber);
    };

    const getLabel = (bahmniOrder: any) => {
        return bahmniOrder.concept.shortName || bahmniOrder.concept.name;
    };

    const openImage = (bahmniOrder: any) => {
        if (!bahmniOrder.pacsStudyUrl) {
            showMessage('info', "NO_PACS_STUDY_FOR_ORDER");
        }
        const url = bahmniOrder.pacsStudyUrl || bahmniOrder.pacsImageUrl;
        window.open(url, "_blank");
    };

            {bahmniOrders.length > 0 ? (
                <ul>
                    {bahmniOrders.map((order) => (
                        <li key={order.orderNumber}>
                            <span>{getLabel(order)}</span>
                            <button onClick={() => openImage(order)}>View Image</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{noOrdersMessage || "No orders available"}</p>
            )}
        </div>

        <div>
            {bahmniOrders.length > 0 ? (
                <ul>
                    {bahmniOrders.map((order) => (
                        <li key={order.orderNumber}>
                            <span>{getLabel(order)}</span>
                            <button onClick={() => openImage(order)}>View Image</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{noOrdersMessage || "No orders available"}</p>
            )}
    );
};

export default PacsOrders;

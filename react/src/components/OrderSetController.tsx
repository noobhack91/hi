import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AdminOrderSetService from '../services/adminOrderSetService';
import OrderTypeService from '../services/orderTypeService';
import useMessagingService from '../services/messagingService';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';
import Spinner from 'react-bootstrap/Spinner';

const OrderSetController: React.FC = () => {
    const [orderSet, setOrderSet] = useState<any>({ orderSetMembers: [] });
    const [orderTypes, setOrderTypes] = useState<any[]>([]);
    const [treatmentConfig, setTreatmentConfig] = useState<any>(null);
    const [operators] = useState(['ALL', 'ANY', 'ONE']);
    const [conceptNameInvalid, setConceptNameInvalid] = useState(false);
    const { showMessage } = useMessagingService();
    const history = useHistory();
    const { orderSetUuid } = useParams<{ orderSetUuid: string }>();

    useEffect(() => {
        const init = async () => {
            try {
                const [loadedOrderTypes, loadedTreatmentConfig] = await Promise.all([
                    OrderTypeService.loadAll(),
                    AdminOrderSetService.getDrugConfig()
                ]);
                setOrderTypes(loadedOrderTypes);
                setTreatmentConfig(loadedTreatmentConfig);

                if (orderSetUuid !== "new") {
                    const response = await AdminOrderSetService.getOrderSet(orderSetUuid);
                    setOrderSet(response.data);
                } else {
                    setOrderSet({
                        operator: operators[0],
                        orderSetMembers: [
                            buildOrderSetMember(loadedOrderTypes),
                            buildOrderSetMember(loadedOrderTypes)
                        ]
                    });
                }
            } catch (error) {
                console.error("Error initializing OrderSetController", error);
            }
        };
        init();
    }, [orderSetUuid, operators]);

    const buildOrderSetMember = (orderTypes: any[]) => {
        return {
            orderType: { uuid: orderTypes[0].uuid }
        };
    };

    const addOrderSetMembers = () => {
        setOrderSet((prevOrderSet: any) => ({
            ...prevOrderSet,
            orderSetMembers: [...prevOrderSet.orderSetMembers, buildOrderSetMember(orderTypes)]
        }));
    };

    const remove = (orderSetMember: any) => {
        setOrderSet((prevOrderSet: any) => {
            const updatedMembers = prevOrderSet.orderSetMembers.map((member: any) => {
                if (member === orderSetMember) {
                    return { ...member, retired: !member.retired };
                }
                return member;
            });
            return { ...prevOrderSet, orderSetMembers: updatedMembers };
        });
    };

    const moveUp = (orderSetMember: any) => {
        setOrderSet((prevOrderSet: any) => {
            const index = prevOrderSet.orderSetMembers.indexOf(orderSetMember);
            if (index > 0) {
                const updatedMembers = [...prevOrderSet.orderSetMembers];
                [updatedMembers[index - 1], updatedMembers[index]] = [updatedMembers[index], updatedMembers[index - 1]];
                return { ...prevOrderSet, orderSetMembers: updatedMembers };
            }
            return prevOrderSet;
        });
    };

    const moveDown = (orderSetMember: any) => {
        setOrderSet((prevOrderSet: any) => {
            const index = prevOrderSet.orderSetMembers.indexOf(orderSetMember);
            if (index < prevOrderSet.orderSetMembers.length - 1) {
                const updatedMembers = [...prevOrderSet.orderSetMembers];
                [updatedMembers[index + 1], updatedMembers[index]] = [updatedMembers[index], updatedMembers[index + 1]];
                return { ...prevOrderSet, orderSetMembers: updatedMembers };
            }
            return prevOrderSet;
        });
    };

    const getConcepts = async (request: any, isOrderTypeMatching: (concept: any) => boolean) => {
        try {
            const response = await axios.get(BahmniCommonConstants.conceptUrl, {
                params: {
                    q: request.term,
                    v: "custom:(uuid,name:(uuid,name),conceptClass:(uuid,name,display))"
                }
            });
            const results = response.data.results;
            const resultsMatched = results.filter(isOrderTypeMatching);
            return resultsMatched.map(mapResponse);
        } catch (error) {
            console.error("Error fetching concepts", error);
            return [];
        }
    };

    const mapResponse = (concept: any) => {
        return {
            concept: { uuid: concept.uuid, name: concept.name.name },
            value: concept.name.name
        };
    };

    const onSelect = (oldOrderSetMember: any) => {
        const currentOrderSetMember = orderSet.orderSetMembers.find((member: any) => {
            return member.concept && (member.concept.display === oldOrderSetMember.value && !member.concept.uuid);
        });
        if (currentOrderSetMember) {
            currentOrderSetMember.concept.uuid = oldOrderSetMember.concept.uuid;
        }
    };

    const onChange = (oldOrderSetMember: any) => {
        oldOrderSetMember.orderTemplate = {};
        delete oldOrderSetMember.concept.uuid;
    };

    const clearConceptName = (orderSetMember: any) => {
        orderSetMember.concept = {};
        orderSetMember.orderTemplate = {};
    };

    const save = async () => {
        if (validationSuccess()) {
            getValidOrderSetMembers();
            try {
                const response = await AdminOrderSetService.createOrUpdateOrderSet(orderSet);
                history.push(`/orderSet/${response.data.uuid}`);
                showMessage('info', 'Saved');
            } catch (error) {
                console.error("Error saving order set", error);
            }
        }
    };

    const getValidOrderSetMembers = () => {
        setOrderSet((prevOrderSet: any) => ({
            ...prevOrderSet,
            orderSetMembers: prevOrderSet.orderSetMembers.filter((member: any) => member.concept)
        }));
    };

    const validationSuccess = () => {
        if (!validateForm()) {
            return false;
        }

        if (!orderSet.orderSetMembers || orderSet.orderSetMembers.filter((member: any) => !member.retired).length < 2) {
            showMessage('error', 'An orderSet should have a minimum of two orderSetMembers');
            return false;
        }

        return true;
    };

    const validateForm = () => {
        const requiredFields = document.querySelectorAll("[required]");
        for (let i = 0; i < requiredFields.length; i++) {
            if (!(requiredFields[i] as HTMLInputElement).disabled && !(requiredFields[i] as HTMLInputElement).value) {
                showMessage('error', 'Please fill all mandatory fields');
                return false;
            }
        }
        return true;
    };

    return (
        <div>

            <h2>Order Set</h2>
    
                <label>Operator:</label>
                <select
                    value={orderSet.operator}
                    onChange={(e) => setOrderSet({ ...orderSet, operator: e.target.value })}
                >
                    {operators.map((operator) => (
                        <option key={operator} value={operator}>
                            {operator}
                        </option>
                    ))}
                </select>
            </div>
    
                <button onClick={addOrderSetMembers}>Add Order Set Member</button>
            </div>
    
                {orderSet.orderSetMembers.map((member: any, index: number) => (
                    <div key={index}>
                        <label>Order Type:</label>
                        <select
                            value={member.orderType.uuid}
                            onChange={(e) => {
                                const updatedMembers = [...orderSet.orderSetMembers];
                                updatedMembers[index].orderType.uuid = e.target.value;
                                setOrderSet({ ...orderSet, orderSetMembers: updatedMembers });
                            }}
                        >
                            {orderTypes.map((orderType) => (
                                <option key={orderType.uuid} value={orderType.uuid}>
                                    {orderType.display}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => remove(member)}>Remove</button>
                        <button onClick={() => moveUp(member)}>Move Up</button>
                        <button onClick={() => moveDown(member)}>Move Down</button>
                    </div>
                ))}
            </div>
    
                <button onClick={save}>Save</button>
            </div>
        </div>
    );
};

export default OrderSetController;

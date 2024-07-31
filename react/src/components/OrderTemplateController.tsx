import React, { useState } from 'react';
import { drugService } from '../services/drugService';
import _ from 'lodash';

interface Drug {
    name: string;
    uuid: string;
    dosageForm: { display: string };
    drugReferenceMaps?: any[];
}

interface OrderTemplate {
    drug: Drug;
    dosingInstructions?: { dosingRule: any };
}

interface OrderSetMember {
    concept: { uuid: string };
    orderTemplate: OrderTemplate;
}

interface SearchResult {
    drug: Drug;
    value: string;
}

const mapResult = (drug: Drug): SearchResult => {
    return {
        drug: {
            name: drug.name,
            uuid: drug.uuid,
            form: drug.dosageForm.display,
            drugReferenceMaps: drug.drugReferenceMaps || []
        },
        value: drug.name
    };
};

const selectDrug = (selectedTemplate: SearchResult, orderSetMember: OrderSetMember) => {
    orderSetMember.orderTemplate.drug = selectedTemplate.drug;
};

const deleteDrugIfDrugNameIsEmpty = (orderSetMember: OrderSetMember) => {
    if (!orderSetMember.orderTemplate.drug.name) {
        orderSetMember.orderTemplate.drug = {} as Drug;
    }
};

const OrderTemplateController: React.FC = () => {
    const [orderSetMembers, setOrderSetMembers] = useState<OrderSetMember[]>([]);

    const search = async (request: { term: string }, orderSetMember: OrderSetMember) => {
        const results = await drugService.search(request.term, orderSetMember.concept.uuid);
        return _.map(results, mapResult);
    };

    const getDrugsOf = (orderSetMember: OrderSetMember) => {
        return (request: { term: string }) => search(request, orderSetMember);
    };

    const onSelectOfDrug = (orderSetMember: OrderSetMember) => {
        return (selectedTemplate: SearchResult) => selectDrug(selectedTemplate, orderSetMember);
    };

    const isRuleMode = (orderSetMember: OrderSetMember) => {
        return typeof orderSetMember.orderTemplate.dosingInstructions !== 'undefined' &&
            orderSetMember.orderTemplate.dosingInstructions.dosingRule != null;
    };

    return (
        <div>

            {orderSetMembers.map((orderSetMember, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Search for a drug"
                        onChange={async (e) => {
                            const results = await getDrugsOf(orderSetMember)({ term: e.target.value });
                            // Handle the search results as needed
                        }}
                    />
                    <select
                        onChange={(e) => {
                            const selectedTemplate = JSON.parse(e.target.value);
                            onSelectOfDrug(orderSetMember)(selectedTemplate);
                        }}
                    >

                        {orderSetMembers.map((orderSetMember, index) => (
                            <option key={index} value={JSON.stringify(orderSetMember)}>
                                {orderSetMember.orderTemplate.drug.name}
                            </option>
                        ))}
                    <button onClick={() => deleteDrugIfDrugNameIsEmpty(orderSetMember)}>
                        Delete Drug if Name is Empty
                    </button>
                    {isRuleMode(orderSetMember) && <div>Rule Mode Active</div>}
                </div>
            ))}
        </div>
    );
};

export default OrderTemplateController;

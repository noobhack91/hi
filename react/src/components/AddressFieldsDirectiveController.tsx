import React, { useState, useEffect } from 'react';
import { addressHierarchyService } from '../services/addressHierarchyService';
import _ from 'lodash';

interface AddressFieldsDirectiveControllerProps {
    address: any;
    addressLevels: any[];
    fieldValidation: any;
    strictAutocompleteFromLevel: string;
}

const AddressFieldsDirectiveController: React.FC<AddressFieldsDirectiveControllerProps> = ({
    address,
    addressLevels,
    fieldValidation,
    strictAutocompleteFromLevel
}) => {
    const [selectedValue, setSelectedValue] = useState<any>({});
    const [addressLevelsChunks, setAddressLevelsChunks] = useState<any[]>([]);

    useEffect(() => {
        const addressLevelsCloneInDescendingOrder = addressLevels.slice(0).reverse();
        setAddressLevelsChunks(chunkArray(addressLevelsCloneInDescendingOrder, 2));
        const addressLevelsNamesInDescendingOrder = addressLevelsCloneInDescendingOrder.map((addressLevel) => addressLevel.addressField);

        const init = () => {
            addressLevels.reverse();
            let isStrictEntry = false;
            addressLevels.forEach((addressLevel) => {
                addressLevel.isStrictEntry = strictAutocompleteFromLevel === addressLevel.addressField || isStrictEntry;
                isStrictEntry = addressLevel.isStrictEntry;
            });
            addressLevels.reverse();

            // wait for address to be resolved in edit patient scenario
            if (address !== undefined) {
                const initialSelectedValue = _.mapValues(address, (value, key) => {
                    const addressLevel = _.find(addressLevels, { addressField: key });
                    return addressLevel && addressLevel.isStrictEntry ? value : null;
                });
                setSelectedValue(initialSelectedValue);
            }
        };

        init();
    }, [address, addressLevels, strictAutocompleteFromLevel]);

    const addressFieldSelected = (fieldName: string) => (addressFieldItem: any) => {
        const addressLevelsNamesInDescendingOrder = addressLevels.slice(0).reverse().map((addressLevel) => addressLevel.addressField);
        const parentFields = addressLevelsNamesInDescendingOrder.slice(addressLevelsNamesInDescendingOrder.indexOf(fieldName) + 1);
        setSelectedValue((prevSelectedValue: any) => ({
            ...prevSelectedValue,
            [fieldName]: addressFieldItem.addressField.name
        }));
        let parent = addressFieldItem.addressField.parent;
        parentFields.forEach((parentField) => {
            if (!parent) {
                return;
            }
            address[parentField] = parent.name;
            setSelectedValue((prevSelectedValue: any) => ({
                ...prevSelectedValue,
                [parentField]: parent.name
            }));
            parent = parent.parent;
        });
    };

    const getTranslatedAddressFields = (address: any) => {
        // SECOND AGENT: [MISSING CONTEXT] - Translation logic needs to be implemented here
    };

    const removeAutoCompleteEntry = (fieldName: string) => () => {
        setSelectedValue((prevSelectedValue: any) => ({
            ...prevSelectedValue,
            [fieldName]: null
        }));
    };

    const getAddressEntryList = (field: string) => async (searchAttrs: any) => {
        return await addressHierarchyService.search(field, searchAttrs.term);
    };

    const clearFields = (fieldName: string) => {
        const addressLevelsNamesInDescendingOrder = addressLevels.slice(0).reverse().map((addressLevel) => addressLevel.addressField);
        const childFields = addressLevelsNamesInDescendingOrder.slice(0, addressLevelsNamesInDescendingOrder.indexOf(fieldName));
        childFields.forEach((childField) => {
            if (!_.isEmpty(selectedValue[childField])) {
                address[childField] = null;
                setSelectedValue((prevSelectedValue: any) => ({
                    ...prevSelectedValue,
                    [childField]: null
                }));
            }
        });
    };

    return (
        <div>

            {addressLevelsChunks.map((chunk, index) => (
                <div key={index} className="address-level-chunk">
                    {chunk.map((addressLevel: any) => (
                        <div key={addressLevel.addressField} className="address-level">
                            <label>{addressLevel.addressField}</label>
                            <input
                                type="text"
                                value={selectedValue[addressLevel.addressField] || ''}
                                onChange={(e) => addressFieldSelected(addressLevel.addressField)({ addressField: { name: e.target.value, parent: null } })}
                                onBlur={() => clearFields(addressLevel.addressField)}
                            />
                            <button onClick={removeAutoCompleteEntry(addressLevel.addressField)}>Clear</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const chunkArray = (array: any[], size: number) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
};

export default AddressFieldsDirectiveController;

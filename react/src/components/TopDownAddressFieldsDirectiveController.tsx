import React, { useState, useEffect } from 'react';
import { addressHierarchyService } from '../services/addressHierarchyService';
import { useTranslation } from 'react-i18next';

interface AddressLevel {
    addressField: string;
    isStrictEntry?: boolean;
    parent?: AddressLevel;
}

interface TopDownAddressFieldsDirectiveControllerProps {
    address: any;
    addressLevels: AddressLevel[];
    fieldValidation: any;
    strictAutocompleteFromLevel: string;
}

const TopDownAddressFieldsDirectiveController: React.FC<TopDownAddressFieldsDirectiveControllerProps> = ({
    address,
    addressLevels,
    fieldValidation,
    strictAutocompleteFromLevel
}) => {
    const [addressFieldInvalid, setAddressFieldInvalid] = useState(false);
    const [selectedAddressUuids, setSelectedAddressUuids] = useState<any>({});
    const [selectedUserGeneratedIds, setSelectedUserGeneratedIds] = useState<any>({});
    const [selectedValue, setSelectedValue] = useState<any>({});
    const { t } = useTranslation();

    const addressLevelsCloneInDescendingOrder = [...addressLevels].reverse();
    const addressLevelsNamesInDescendingOrder = addressLevelsCloneInDescendingOrder.map(level => level.addressField);

    const populateSelectedAddressUuids = async (levelIndex: number, parentUuid?: string) => {
        if (addressLevels.length === 0 || !addressLevels[levelIndex]) {
            return;
        }

        const fieldName = addressLevels[levelIndex].addressField;
        const addressValue = address[fieldName];
        if (addressValue) {
            try {
                const response = await addressHierarchyService.search(fieldName, addressValue, parentUuid || '');
                const addressData = response && response[0];
                if (addressData) {
                    setSelectedAddressUuids((prev: any) => ({ ...prev, [fieldName]: addressData.uuid }));
                    setSelectedUserGeneratedIds((prev: any) => ({ ...prev, [fieldName]: addressData.userGeneratedId }));
                    populateSelectedAddressUuids(levelIndex + 1, addressData.uuid);
                }
            } catch (error) {
                console.error('Error fetching address hierarchy entries:', error);
            }
        }
    };

    const getTranslatedTopAddress = (address: any) => {
        // SECOND AGENT: [MISSING CONTEXT] - Translation utility function needs to be implemented
        return address;
    };

    const addressFieldSelected = (fieldName: string) => (addressFieldItem: any) => {
        setSelectedAddressUuids((prev: any) => ({ ...prev, [fieldName]: addressFieldItem.addressField.uuid }));
        setSelectedUserGeneratedIds((prev: any) => ({ ...prev, [fieldName]: addressFieldItem.addressField.userGeneratedId }));
        setSelectedValue((prev: any) => ({ ...prev, [fieldName]: addressFieldItem.addressField.name }));

        const parentFields = addressLevelsNamesInDescendingOrder.slice(addressLevelsNamesInDescendingOrder.indexOf(fieldName) + 1);
        let parent = addressFieldItem.addressField.parent;
        parentFields.forEach(parentField => {
            if (!parent) {
                return;
            }
            address[parentField] = parent.name;
            setSelectedValue((prev: any) => ({ ...prev, [parentField]: parent.name }));
            parent = parent.parent;
        });
    };

    const findParentField = (fieldName: string) => {
        const found = addressLevels.find(level => level.addressField === fieldName);
        const index = addressLevels.indexOf(found!);
        if (index > 0) {
            return addressLevels[index - 1].addressField;
        }
        return undefined;
    };

    const isReadOnly = (addressLevel: AddressLevel) => {
        if (!address) {
            return false;
        }
        if (!addressLevel.isStrictEntry) {
            return false;
        }
        const fieldName = addressLevel.addressField;
        const parentFieldName = findParentField(fieldName);
        const parentValue = address[parentFieldName!];
        const parentValueInvalid = isParentValueInvalid(parentFieldName!);
        if (!parentFieldName) {
            return false;
        }
        if (parentFieldName && !parentValue) {
            return true;
        }
        return parentFieldName && parentValue && parentValueInvalid;
    };

    const isParentValueInvalid = (parentId: string) => {
        // SECOND AGENT: [MISSING CONTEXT] - Implement logic to check if parent value is invalid
        return false;
    };

    const parentUuid = (field: string) => {
        return selectedAddressUuids[findParentField(field)!];
    };

    const getAddressEntryList = (field: string) => async (searchAttrs: any) => {
        return await addressHierarchyService.search(field, searchAttrs.term, parentUuid(field));
    };

    const clearFields = (fieldName: string) => {
        const childFields = addressLevelsNamesInDescendingOrder.slice(0, addressLevelsNamesInDescendingOrder.indexOf(fieldName));
        childFields.forEach(childField => {
            if (selectedValue[childField] !== null) {
                address[childField] = null;
                setSelectedValue((prev: any) => ({ ...prev, [childField]: null }));
                setSelectedAddressUuids((prev: any) => ({ ...prev, [childField]: null }));
                setSelectedUserGeneratedIds((prev: any) => ({ ...prev, [childField]: null }));
            }
        });

        if (!address[fieldName]) {
            address[fieldName] = null;
            setSelectedUserGeneratedIds((prev: any) => ({ ...prev, [fieldName]: null }));
        }
    };

    const removeAutoCompleteEntry = (fieldName: string) => () => {
        setSelectedValue((prev: any) => ({ ...prev, [fieldName]: null }));
    };

    useEffect(() => {
        const init = () => {
            addressLevels.reverse();
            let isStrictEntry = false;
            addressLevels.forEach(addressLevel => {
                addressLevel.isStrictEntry = strictAutocompleteFromLevel === addressLevel.addressField || isStrictEntry;
                isStrictEntry = addressLevel.isStrictEntry;
            });
            addressLevels.reverse();

            populateSelectedAddressUuids(0);
            setSelectedValue(
                Object.fromEntries(
                    Object.entries(address).map(([key, value]) => {
                        const addressLevel = addressLevels.find(level => level.addressField === key);
                        return [key, addressLevel && addressLevel.isStrictEntry ? value : null];
                    })
                )
            );
        };
        init();
    }, [address, addressLevels, strictAutocompleteFromLevel]);

    return (
        <div>

            {addressLevels.map((addressLevel, index) => (
                <div key={addressLevel.addressField}>
                    <label htmlFor={addressLevel.addressField}>
                        {t(`address.${addressLevel.addressField}`)}
                    </label>
                    <input
                        type="text"
                        id={addressLevel.addressField}
                        value={selectedValue[addressLevel.addressField] || ''}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setSelectedValue((prev: any) => ({ ...prev, [addressLevel.addressField]: newValue }));
                            if (newValue) {
                                addressFieldSelected(addressLevel.addressField)({ addressField: { name: newValue, uuid: '', parent: null } });
                            } else {
                                clearFields(addressLevel.addressField);
                            }
                        }}
                        readOnly={isReadOnly(addressLevel)}
                    />
                </div>
            ))}
        </div>
    );
};

export default TopDownAddressFieldsDirectiveController;

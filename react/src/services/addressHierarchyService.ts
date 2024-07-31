import axios from 'axios';

const parseSearchString = (searchString: string): string => {
    searchString = searchString.replace(new RegExp("\\(", "g"), "\\(");
    searchString = searchString.replace(new RegExp("\\)", "g"), "\\)");
    return searchString;
};

const search = async (fieldName: string, query: string, parentUuid: string | null): Promise<any> => {
    const params = { searchString: query, addressField: fieldName, parentUuid: parentUuid, limit: defaults.maxAutocompleteResults };
    const url = `${Bahmni.Registration.Constants.openmrsUrl}/module/addresshierarchy/ajax/getPossibleAddressHierarchyEntriesWithParents.form`;

    try {
        const response = await axios.get(url, {
            params: params,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching address hierarchy entries:', error);
        throw error;
    }
};

const getNextAvailableParentName = (addressField: any): string => {
    let parent = addressField.parent;
    while (parent) {
        if (parent.name) {
            return parent.name;
        } else {
            parent = parent.parent;
        }
    }
    return "";
};

const getAddressDataResults = (data: any): any[] => {
    return data ? data.map((addressField: any) => {
        const parentName = getNextAvailableParentName(addressField);
        return {
            'value': addressField.name,
            'label': addressField.name + (parentName ? ", " + parentName : ""),
            addressField: addressField
        };
    }) : [];
};

export const addressHierarchyService = {
    parseSearchString,
    search,
    getNextAvailableParentName,
    getAddressDataResults
};

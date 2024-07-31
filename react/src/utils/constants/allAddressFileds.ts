// Type definition for address fields
type AddressField = {
    uuid: string;
    preferred: boolean;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    address6: string;
    cityVillage: string;
    countyDistrict: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    latitude: string;
    longitude: string;
};

// Constant array of address fields
export const allAddressFields: (keyof AddressField)[] = [
    "uuid",
    "preferred",
    "address1",
    "address2",
    "address3",
    "address4",
    "address5",
    "address6",
    "cityVillage",
    "countyDistrict",
    "stateProvince",
    "postalCode",
    "country",
    "latitude",
    "longitude"
];

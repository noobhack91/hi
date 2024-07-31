// TypeScript constant for React components

export const errorMessages = {
    discontinuingAndOrderingSameDrug: "DISCONTINUING_AND_ORDERING_SAME_DRUG_NOT_ALLOWED",
    incompleteForm: "INCOMPLETE_FORM_ERROR_MESSAGE",
    invalidItems: "Highlighted items in New Prescription section are incomplete. Please edit or remove them to continue",
    conceptNotNumeric: "CONCEPT_NOT_NUMERIC"
};

export type ErrorMessages = typeof errorMessages;

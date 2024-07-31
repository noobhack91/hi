// Define the type for error messages
type ErrorMessages = {
    discontinuingAndOrderingSameDrug: string;
    incompleteForm: string;
    invalidItems: string;
    conceptNotNumeric: string;
};

// Define the error messages constant
const errorMessages: ErrorMessages = {
    discontinuingAndOrderingSameDrug: "DISCONTINUING_AND_ORDERING_SAME_DRUG_NOT_ALLOWED",
    incompleteForm: "INCOMPLETE_FORM_ERROR_MESSAGE",
    invalidItems: "Highlighted items in New Prescription section are incomplete. Please edit or remove them to continue",
    conceptNotNumeric: "CONCEPT_NOT_NUMERIC"
};

export default errorMessages;

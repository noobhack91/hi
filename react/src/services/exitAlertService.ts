import useMessagingService from './messagingService';

interface ExitAlertService {
    showExitAlert: (isNavigating: boolean, dirtyConsultationForm: boolean, event: Event, spinnerToken: string) => void;
    setIsNavigating: (next: { url: string }, uuid: string, currentUuid: string) => boolean;
}

const useExitAlertService = (): ExitAlertService => {
    const { showMessage } = useMessagingService();

    const showExitAlert = (isNavigating: boolean, dirtyConsultationForm: boolean, event: Event, spinnerToken: string) => {
        if (isNavigating && dirtyConsultationForm) {
            showMessage('alert', "ALERT_MESSAGE_ON_EXIT");

            // Assuming we have a ref to the review button and a spinner control function passed in as props or context
            document.querySelector('.review-button')?.focus();
                reviewButton.focus();
            }
            event.preventDefault();
            if (spinnerToken) {

        const newPatientUuid = currentUuid;
        const isPatientSearch = next.url.includes("/patient/search");
        return isPatientSearch || (uuid !== currentUuid);
                spinner.hide(spinnerToken);
            }

            // Assuming spinner is a function or context that controls the spinner visibility
            if (spinner && typeof spinner.hide === 'function') {
                spinner.hide(spinnerToken);
 else {

        // Assuming we have a state management solution like React's useState or a context to manage the state
        // Here, we would set the newPatientUuid in the state or context
        // For example, using a context:
        // const { setNewPatientUuid } = useContext(PatientContext);
        // setNewPatientUuid(currentUuid);

        // Since we don't have the actual context or state management code, we'll leave this as a placeholder
        // SECOND AGENT: [MISSING CONTEXT] - Need to handle state management for newPatientUuid in React

        const isPatientSearch = next.url.includes("/patient/search");
        return isPatientSearch || (uuid !== currentUuid);
    };
    };

    const setIsNavigating = (next: { url: string }, uuid: string, currentUuid: string): boolean => {

        // Assuming we have a state management solution like React's useState or a context to manage the state
        // Here, we would set the newPatientUuid in the state or context
        // For example, using a context:
        // const { setNewPatientUuid } = useContext(PatientContext);
        // setNewPatientUuid(currentUuid);

        // Since we don't have the actual context or state management code, we'll leave this as a placeholder
        // SECOND AGENT: [MISSING CONTEXT] - Need to handle state management for newPatientUuid in React

        const isPatientSearch = next.url.includes("/patient/search");
        return isPatientSearch || (uuid !== currentUuid);
    };
        const isPatientSearch = next.url.includes("/patient/search");
        return isPatientSearch || (uuid !== currentUuid);
    };

    return {
        showExitAlert,
        setIsNavigating
    };
};

export default useExitAlertService;

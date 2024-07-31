import { useEffect } from 'react';
import { useMessagingService } from './messagingService';

const useStateChangeSpinner = (spinner: { show: () => string; hide: (token: string) => void }) => {
    const { showMessage } = useMessagingService();

    useEffect(() => {
        const showSpinner = (event: Event, toState: { spinnerToken?: string }) => {
            toState.spinnerToken = spinner.show();
        };

        const hideSpinner = (event: Event, toState: { spinnerToken?: string }) => {
            if (toState.spinnerToken) {
                spinner.hide(toState.spinnerToken);
            }
        };

        const handleStateChangeStart = (event: Event) => {
            showSpinner(event, {});
        };

        const handleStateChangeSuccess = (event: Event) => {
            hideSpinner(event, {});
        };

        const handleStateChangeError = (event: Event) => {
            hideSpinner(event, {});
            showMessage('error', 'State change error occurred');
        };

        window.addEventListener('stateChangeStart', handleStateChangeStart);
        window.addEventListener('stateChangeSuccess', handleStateChangeSuccess);
        window.addEventListener('stateChangeError', handleStateChangeError);

        return () => {
            window.removeEventListener('stateChangeStart', handleStateChangeStart);
            window.removeEventListener('stateChangeSuccess', handleStateChangeSuccess);
            window.removeEventListener('stateChangeError', handleStateChangeError);
        };
    }, [spinner, showMessage]);
};

export default useStateChangeSpinner;

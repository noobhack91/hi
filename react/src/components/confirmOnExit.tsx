import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmOnExit: React.FC = () => {
    const { t } = useTranslation();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = t("BROWSER_CLOSE_DIALOG_MESSAGE_KEY");
            event.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [t]);

    return null;
};

export default ConfirmOnExit;

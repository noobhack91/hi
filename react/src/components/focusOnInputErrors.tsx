import React, { useEffect } from 'react';

interface FocusOnInputErrorsProps {
    eventEmitter: any; // Replace 'any' with the appropriate type for your event emitter
}

const FocusOnInputErrors: React.FC<FocusOnInputErrorsProps> = ({ eventEmitter }) => {
    useEffect(() => {
        const handleErrorsOnForm = () => {
            setTimeout(() => {
                const illegalValueButton = document.querySelector('.illegalValue:first-of-type button') as HTMLElement;
                const illegalValue = document.querySelector('.illegalValue:first-of-type') as HTMLElement;
                if (illegalValueButton) {
                    illegalValueButton.focus();
                } else if (illegalValue) {
                    illegalValue.focus();
                }
            }, 10);
        };

        eventEmitter.on("event:errorsOnForm", handleErrorsOnForm);

        return () => {
            eventEmitter.off("event:errorsOnForm", handleErrorsOnForm);
        };
    }, [eventEmitter]);

    return null;
};

export default FocusOnInputErrors;

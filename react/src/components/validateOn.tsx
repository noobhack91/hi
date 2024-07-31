import React, { useEffect } from 'react';

interface ValidateOnProps {
    validateOn: any;
    validationMessage?: string;
    value: any;
    onChange: (value: any) => void;
}

const ValidateOn: React.FC<ValidateOnProps> = ({ validateOn, validationMessage = 'Please enter a valid detail', value, onChange }) => {
    useEffect(() => {
        const setValidity = (value: any) => {
            const valid = value ? true : false;
            // Assuming we have a ref to the input element
            const inputElement = document.querySelector('input'); // This should be more specific in a real scenario
            if (inputElement) {
                inputElement.setCustomValidity(!valid ? validationMessage : '');
            }
        };

        setValidity(value);
    }, [validateOn, validationMessage, value]);

    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default ValidateOn;

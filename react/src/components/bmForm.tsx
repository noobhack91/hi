import React, { useEffect, useRef } from 'react';

interface BmFormProps {
    name: string;
    autofillable: boolean;
    onSubmit: () => void;
}

const BmForm: React.FC<BmFormProps> = ({ name, autofillable, onSubmit, children }) => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleSubmit = (e: Event) => {
            e.preventDefault();
            if (autofillable) {
                const inputs = formRef.current?.querySelectorAll('input');
                inputs?.forEach(input => input.dispatchEvent(new Event('change', { bubbles: true })));
            }
            if (formRef.current?.checkValidity()) {
                onSubmit();
                formRef.current?.classList.remove('submitted-with-error');
            } else {
                formRef.current?.classList.add('submitted-with-error');
            }
        };

        const formElement = formRef.current;
        formElement?.addEventListener('submit', handleSubmit);

        return () => {
            formElement?.removeEventListener('submit', handleSubmit);
        };
    }, [autofillable, onSubmit]);

    return (
        <form ref={formRef} name={name}>
            {children}
        </form>
    );
};

export default BmForm;

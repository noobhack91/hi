import React, { useEffect } from 'react';

interface PatternValidateProps {
    id: string;
    fieldValidation: { [key: string]: { pattern: string, errorMessage: string } };
}

const PatternValidate: React.FC<PatternValidateProps> = ({ id, fieldValidation }) => {
    useEffect(() => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element && fieldValidation && fieldValidation[id]) {
            element.setAttribute("pattern", fieldValidation[id].pattern);
            element.setAttribute("title", fieldValidation[id].errorMessage);
            element.setAttribute("type", "text");
        }
    }, [id, fieldValidation]);

    return null;
};

export default PatternValidate;

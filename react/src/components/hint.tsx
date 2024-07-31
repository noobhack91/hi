import React from 'react';

interface HintProps {
    conceptDetails: any; // Adjust the type according to the actual structure of conceptDetails
}

const Hint: React.FC<HintProps> = ({ conceptDetails }) => {
    const getHintForNumericConcept = (details: any) => {

        if (!details || !details.numericDetails) {
            return '';
        }

        const { lowAbsolute, highAbsolute, units } = details.numericDetails;

        if (lowAbsolute != null && highAbsolute != null) {
            return `Normal range: ${lowAbsolute} - ${highAbsolute} ${units}`;
        } else if (lowAbsolute != null) {
            return `Minimum value: ${lowAbsolute} ${units}`;
        } else if (highAbsolute != null) {
            return `Maximum value: ${highAbsolute} ${units}`;
        } else {
            return '';
        }
    };
        return ''; // Placeholder return value
    };

    const hintForNumericConcept = getHintForNumericConcept(conceptDetails);

    return (
        <small className="hint">
            {hintForNumericConcept}
        </small>
    );
};

export default Hint;

import React, { useEffect } from 'react';

interface NonBlankProps {
    nonBlank?: boolean;
    onChange?: (value: boolean) => void;
}

const NonBlank: React.FC<NonBlankProps> = ({ nonBlank, onChange }) => {
    const elementRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const addNonBlankAttrs = () => {
            element.setAttribute('required', 'required');
        };

        const removeNonBlankAttrs = () => {
            element.removeAttribute('required');
        };

        if (nonBlank === undefined) {
            addNonBlankAttrs();
        } else {
            nonBlank ? addNonBlankAttrs() : removeNonBlankAttrs();
        }
    }, [nonBlank]);

    return (
        <input
            ref={elementRef}
            onChange={(e) => onChange && onChange(e.target.value !== '')}
        />
    );
};

export default NonBlank;

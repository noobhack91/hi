import React, { useEffect, useRef } from 'react';

interface FocusOnProps {
    shouldFocus: boolean;
}

const FocusOn: React.FC<FocusOnProps> = ({ shouldFocus, children }) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (shouldFocus && elementRef.current) {
            elementRef.current.focus();
        }
    }, [shouldFocus]);

    return (
        <div ref={elementRef} tabIndex={-1}>
            {children}
        </div>
    );
};

export default FocusOn;

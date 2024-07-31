import React, { useEffect, useRef } from 'react';

interface FocusMeProps {
    shouldFocus: boolean;
}

const FocusMe: React.FC<FocusMeProps> = ({ shouldFocus, children }) => {
    const elementRef = useRef<HTMLDivElement>(null);

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

export default FocusMe;

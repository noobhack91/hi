import React, { useEffect, useRef } from 'react';

interface AssignHeightProps {
    keyName: string;
    onHeightChange: (height: number) => void;
}

const AssignHeight: React.FC<AssignHeightProps> = ({ keyName, onHeightChange }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (elementRef.current) {
                const height = elementRef.current.offsetHeight;
                onHeightChange(height);
            }
        };

        handleResize(); // Initial height assignment
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [onHeightChange]);

    return <div ref={elementRef} data-key={keyName}></div>;
};

export default AssignHeight;

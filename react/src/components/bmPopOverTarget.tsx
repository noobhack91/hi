import React, { useEffect, useRef } from 'react';

interface BmPopOverTargetProps {
    registerTargetElement: (element: HTMLElement) => void;
}

const BmPopOverTarget: React.FC<BmPopOverTargetProps> = ({ registerTargetElement, children }) => {
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (targetRef.current) {
            registerTargetElement(targetRef.current);
        }
    }, [registerTargetElement]);

    return (
        <div ref={targetRef} style={{ display: 'none' }}>
            {children}
        </div>
    );
};

export default BmPopOverTarget;

import React, { useEffect } from 'react';

interface AutoScrollProps {
    autoScrollEnabled: boolean;
    targetId: string;
}

const AutoScroll: React.FC<AutoScrollProps> = ({ autoScrollEnabled, targetId }) => {
    const heightOfNavigationBar = 55;

    useEffect(() => {
        if (autoScrollEnabled) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - heightOfNavigationBar,
                    behavior: 'smooth'
                });
            }
        }

        return () => {
            window.scrollTo({
                top: -1 * heightOfNavigationBar,
                behavior: 'auto'
            });
        };
    }, [autoScrollEnabled, targetId]);

    return null;
};

export default AutoScroll;

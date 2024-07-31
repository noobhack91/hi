import React, { useEffect, useRef } from 'react';

interface ScrollToObsElementProps {
    shouldScroll: boolean;
    onScrollComplete: () => void;
}

const ScrollToObsElement: React.FC<ScrollToObsElementProps> = ({ shouldScroll, onScrollComplete }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shouldScroll && elementRef.current) {
            const elem = elementRef.current;
            const scrollPosition = elem.offsetTop - window.innerHeight / 2;

            if (document.getElementById('scrollOnEdit')) {
                const container = document.getElementById('scrollOnEdit');
                if (container) {
                    const scrollTo = elem;
                    const containerScrollPosition = scrollTo.offsetTop + container.scrollTop - (container.offsetTop + container.offsetTop / 2);
                    container.scrollTo({ top: containerScrollPosition, behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }

            onScrollComplete();
        }
    }, [shouldScroll, onScrollComplete]);

    return <div ref={elementRef}> {/* SECOND AGENT: [MISSING CONTEXT] - Content to be scrolled to should be placed here */} </div>;
};

export default ScrollToObsElement;

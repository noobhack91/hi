import React, { useState, useEffect, useRef } from 'react';
import './scrollableTabs.css'; // Assuming you have a CSS file for styling

const ScrollableTabs: React.FC = ({ children }) => {
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const scrollContainerRef = useRef<HTMLUListElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const scrollContainer = scrollContainerRef.current;
            const scrollPos = Math.min(scrollContainer.scrollLeft + scrollContainer.offsetWidth / 3, 0);
            scrollContainer.scrollTo({ left: scrollPos, behavior: 'smooth' });
            setShowLeft(scrollPos < 0);
            setShowRight(true);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollContainer = scrollContainerRef.current;
            const scrollingWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
            const scrollPos = Math.min(Math.abs(scrollContainer.scrollLeft - scrollContainer.offsetWidth / 3), scrollingWidth);
            scrollContainer.scrollTo({ left: scrollPos, behavior: 'smooth' });
            setShowLeft(true);
            setShowRight(scrollingWidth > scrollPos);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (scrollContainerRef.current) {
                const scrollContainer = scrollContainerRef.current;
                const scrollingWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
                setShowRight(scrollingWidth > 0 && Math.abs(scrollContainer.scrollLeft) < scrollingWidth);
                setShowLeft(scrollingWidth > 0 && scrollContainer.scrollLeft < 0);
                if (!showRight && !showLeft) {
                    scrollContainer.scrollTo({ left: 0 });
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showLeft, showRight]);

    useEffect(() => {
        const detectSwipe = (evt: TouchEvent) => {
            // SECOND AGENT: [MISSING CONTEXT] - Implement swipe detection logic here
        };

        window.addEventListener('touchstart', detectSwipe);
        return () => {
            window.removeEventListener('touchstart', detectSwipe);
        };
    }, []);

    return (
        <div className="scrollable-tabs">
            <button type="button" className="arrow-left" onClick={scrollLeft} style={{ display: showLeft ? 'block' : 'none' }}>
                <span className="fa fa-angle-left"></span>
            </button>
            <ul ref={scrollContainerRef}>
                {children}
            </ul>
            <button type="button" className="arrow-right" onClick={scrollRight} style={{ display: showRight ? 'block' : 'none' }}>
                <span className="fa fa-angle-right"></span>
            </button>
        </div>
    );
};

export default ScrollableTabs;

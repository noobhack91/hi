import React, { useEffect, useState } from 'react';

interface DashboardSectionProps {
    section: {
        isDataAvailable: boolean;
        hideEmptyDisplayControl: boolean;
    };
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ section }) => {
    const [isDataAvailable, setIsDataAvailable] = useState(section.isDataAvailable);

    useEffect(() => {
        const handleNoDataPresentEvent = () => {
            setIsDataAvailable(!section.hideEmptyDisplayControl);
        };

        // Assuming there's a global event bus or similar mechanism to listen to events
        window.addEventListener("no-data-present-event", handleNoDataPresentEvent);

        return () => {
            window.removeEventListener("no-data-present-event", handleNoDataPresentEvent);
        };
    }, [section.hideEmptyDisplayControl]);

    return (
        <div>
            {/* Render the section based on isDataAvailable */}
            {isDataAvailable ? (
                <div>Data is available</div>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default DashboardSection;

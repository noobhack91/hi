import React, { useEffect, useState } from 'react';

const patientTileWidth = 200; // Example value, replace with actual constant
const patientTileHeight = 300; // Example value, replace with actual constant
const tileLoadRatio = 0.5; // Example value, replace with actual constant

interface ResizeProps {
    searchResults: any[];
    visibleResults: any[];
    setVisibleResults: (results: any[]) => void;
}

const Resize: React.FC<ResizeProps> = ({ searchResults, visibleResults, setVisibleResults }) => {
    const [tilesToFit, setTilesToFit] = useState(0);
    const [tilesToLoad, setTilesToLoad] = useState(0);

    const storeWindowDimensions = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const tilesToFit = Math.ceil(windowWidth * windowHeight / (patientTileWidth * patientTileHeight));
        setTilesToFit(tilesToFit);
        setTilesToLoad(Math.ceil(tilesToFit * tileLoadRatio));
    };

    const updateVisibleResults = () => {
        setVisibleResults(searchResults.slice(0, tilesToLoad));
    };

    const loadMore = () => {
        const last = visibleResults.length;
        const more = (searchResults.length - last);
        const toShow = (more > tilesToLoad) ? tilesToLoad : more;
        if (toShow > 0) {
            setVisibleResults([...visibleResults, ...searchResults.slice(last, last + toShow)]);
        }
    };

    useEffect(() => {
        storeWindowDimensions();
        window.addEventListener('resize', storeWindowDimensions);
        return () => {
            window.removeEventListener('resize', storeWindowDimensions);
        };
    }, []);

    useEffect(() => {
        updateVisibleResults();
    }, [searchResults, tilesToFit]);

    return (
        <div onScroll={loadMore}>
            {visibleResults.map((result, index) => (
                <div key={index}>
                    {/* Render each result here */}
                </div>
            ))}
        </div>
    );
};

export default Resize;

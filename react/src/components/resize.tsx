import React, { useEffect, useState } from 'react';
import { Constants } from '../utils/constants';

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
        const tileWidth = Constants.patientTileWidth;
        const tileHeight = Constants.patientTileHeight;
        const tilesToFit = Math.ceil(windowWidth * windowHeight / (tileWidth * tileHeight));
        setTilesToFit(tilesToFit);
        setTilesToLoad(Math.ceil(tilesToFit * Constants.tileLoadRatio));
    };

    const updateVisibleResults = () => {
        setVisibleResults(searchResults.slice(0, tilesToLoad));
    };

    const loadMore = () => {
        const last = visibleResults.length;
        const more = (searchResults.length - last);
        const toShow = (more > tilesToLoad) ? tilesToLoad : more;
        if (toShow > 0) {
            const newVisibleResults = [...visibleResults];
            for (let i = 1; i <= toShow; i++) {
                newVisibleResults.push(searchResults[last + i - 1]);
            }
            setVisibleResults(newVisibleResults);
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
                    {/* Render your result item here */}
                    {result}
                </div>
            ))}
        </div>
    );
};

export default Resize;

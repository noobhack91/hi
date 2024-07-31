import React, { useState, useEffect } from 'react';

interface SingleClickProps {
    singleClick: () => Promise<void>;
}

const SingleClick: React.FC<SingleClickProps> = ({ singleClick, children }) => {
    const [ignoreClick, setIgnoreClick] = useState(false);

    const clickHandler = async () => {
        if (ignoreClick) {
            return;
        }
        setIgnoreClick(true);
        try {
            await singleClick();
        } finally {
            setIgnoreClick(false);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup if needed when component is unmounted
        };
    }, []);

    return (
        <div onClick={clickHandler}>
            {children}
        </div>
    );
};

export default SingleClick;

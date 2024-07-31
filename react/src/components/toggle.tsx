import React, { useState, useEffect } from 'react';

interface ToggleProps {
    initialToggle?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ initialToggle = false }) => {
    const [toggle, setToggle] = useState(initialToggle);

    useEffect(() => {
        const handleClick = () => {
            setToggle(prevToggle => !prevToggle);
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        const element = document.querySelector('.toggle-element');
        if (element) {
            if (toggle) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    }, [toggle]);

    return (
        <div className={`toggle-element ${toggle ? 'active' : ''}`}>

            {/* Add any child components or elements that should be toggled */}
            <p>{toggle ? 'The toggle is ON' : 'The toggle is OFF'}</p>
        </div>
    );
};

export default Toggle;

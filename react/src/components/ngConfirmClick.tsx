import React from 'react';

interface NgConfirmClickProps {
    confirmMessage?: string;
    onConfirm: () => void;
}

const NgConfirmClick: React.FC<NgConfirmClickProps> = ({ confirmMessage = "Are you sure?", onConfirm, children }) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (window.confirm(confirmMessage)) {
            onConfirm();
        }
    };

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    );
};

export default NgConfirmClick;

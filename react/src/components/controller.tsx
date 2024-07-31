import React, { useState } from 'react';

interface Observation {
    hasValueOf: (answer: any) => boolean;
    toggleSelection: (answer: any) => void;
    onValueChanged?: () => void;
}

interface ButtonSelectProps {
    observation: Observation;
    abnormalObs?: any;
    handleUpdate: () => void;
}

const ButtonSelect: React.FC<ButtonSelectProps> = ({ observation, abnormalObs, handleUpdate }) => {
    const isSet = (answer: any) => {
        return observation.hasValueOf(answer);
    };

    const select = (answer: any) => {
        observation.toggleSelection(answer);
        if (observation.onValueChanged) {
            observation.onValueChanged();
        }
        handleUpdate();
    };

    const getAnswerDisplayName = (answer: any) => {
        const shortName = answer.names ? answer.names.find((name: any) => name.conceptNameType === 'SHORT') : null;
        return shortName ? shortName.name : answer.displayString;
    };

    return (
        <div>

            {observation.answers.map((answer: any, index: number) => (
                <button
                    key={index}
                    className={`btn ${isSet(answer) ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => select(answer)}
                >
                    {getAnswerDisplayName(answer)}
                </button>
            ))}
        </div>
    );
};

export default ButtonSelect;

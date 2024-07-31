import React, { useState } from 'react';

interface Answer {
    names?: { conceptNameType: string, name: string }[];
    displayString: string;
}

interface Observation {
    hasValueOf: (answer: Answer) => boolean;
    toggleSelection: (answer: Answer) => void;
    onValueChanged?: () => void;
}

interface ButtonSelectProps {
    observation: Observation;
    abnormalObs?: boolean;
    dirtyCheckFlag?: boolean;
    handleUpdate: () => void;
}

const ButtonSelect: React.FC<ButtonSelectProps> = ({ observation, abnormalObs, dirtyCheckFlag, handleUpdate }) => {
    const [hasDirtyFlag, setHasDirtyFlag] = useState<boolean>(!!dirtyCheckFlag);

    const isSet = (answer: Answer): boolean => {
        return observation.hasValueOf(answer);
    };

    const select = (answer: Answer): void => {
        observation.toggleSelection(answer);
        if (observation.onValueChanged) {
            observation.onValueChanged();
        }
        handleUpdate();
    };

    const getAnswerDisplayName = (answer: Answer): string => {
        const shortName = answer.names ? answer.names.find(name => name.conceptNameType === 'SHORT') : null;
        return shortName ? shortName.name : answer.displayString;
    };

    return (
        <div>

            {observation.answers.map((answer, index) => (
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

import React, { useState, useEffect } from 'react';
import './splitButton.css';

interface Option {
    shortcutKey: string;
    // Add other properties as needed
}

interface SplitButtonProps {
    options: Option[];
    primaryOption?: Option;
    optionText: (option: Option, type: string) => string;
    optionClick: (option: Option) => void;
    optionDisabled: boolean;
}

const SplitButton: React.FC<SplitButtonProps> = ({ options, primaryOption, optionText, optionClick, optionDisabled }) => {
    const [primary, setPrimary] = useState<Option>(primaryOption || options[0]);
    const [secondaryOptions, setSecondaryOptions] = useState<Option[]>(options.filter(option => option !== primary));

    useEffect(() => {
        setPrimary(primaryOption || options[0]);
        setSecondaryOptions(options.filter(option => option !== primary));
    }, [options, primaryOption]);

    const hasMultipleOptions = () => secondaryOptions.length > 0;

    const scrollToBottom = () => {
        const element = document.querySelector('.split-button');
        if (element) {
            const scrollHeight = element.scrollHeight;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const windowHeight = window.innerHeight + window.scrollY;
            if (windowHeight < (scrollHeight + elementPosition)) {
                window.scrollBy(0, scrollHeight);
            }
        }
    };

    return (
        <div className="split-button">
            {hasMultipleOptions() && (
                <button
                    className="toggle-button fa fa-caret-down"
                    onClick={scrollToBottom}
                    disabled={optionDisabled}
                    type="button"
                ></button>
            )}
            <ul className="options">
                <li className="primaryOption">
                    <button
                        className="buttonClass"
                        onClick={() => optionClick(primary)}
                        accessKey={primary.shortcutKey}
                        disabled={optionDisabled}
                        dangerouslySetInnerHTML={{ __html: optionText(primary, 'primary') }}
                    ></button>
                </li>
                <ul className="hidden-options">
                    {secondaryOptions.map(option => (
                        <li key={option.shortcutKey} className="secondaryOption">
                            <button
                                className="buttonClass"
                                onClick={() => optionClick(option)}
                                accessKey={option.shortcutKey}
                                disabled={optionDisabled}
                                dangerouslySetInnerHTML={{ __html: optionText(option, '') }}
                            ></button>
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default SplitButton;

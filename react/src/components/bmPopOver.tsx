import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

interface BmPopOverProps {
    autoclose: boolean;
}

const BmPopOver: React.FC<BmPopOverProps> = ({ autoclose, children }) => {
    const [isTargetOpen, setIsTargetOpen] = useState(false);
    const targetElements = useRef<HTMLElement[]>([]);
    const triggerElement = useRef<HTMLElement | null>(null);

    const hideTargetElements = () => {
        targetElements.current.forEach(el => $(el).hide());
    };

    const showTargetElements = () => {
        targetElements.current.forEach(el => $(el).show());
    };

    const docClickHandler = () => {
        if (!autoclose) {
            return;
        }
        hideTargetElements();
        setIsTargetOpen(false);
        $(document).off('click', docClickHandler);
    };

    const registerTriggerElement = (element: HTMLElement) => {
        triggerElement.current = element;

        $(element).on('click', (event) => {
            if (isTargetOpen) {
                setIsTargetOpen(false);
                hideTargetElements();
                $(document).off('click', docClickHandler);
            } else {
                $('.tooltip').hide();
                setIsTargetOpen(true);
                showTargetElements();
                $(document).on('click', docClickHandler);
                event.stopImmediatePropagation();
            }
        });
    };

    const registerTargetElement = (element: HTMLElement) => {
        $(element).hide();
        targetElements.current.push(element);
    };

    const hideOrShowTargetElements = () => {
        if (isTargetOpen) {
            setIsTargetOpen(false);
            hideTargetElements();
        }
    };

    useEffect(() => {
        $(document).on('click', '.reg-wrapper', hideOrShowTargetElements);

        return () => {
            $(document).off('click', '.reg-wrapper', hideOrShowTargetElements);
        };
    }, [isTargetOpen]);

    return (
        <div>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    if (child.props['data-role'] === 'trigger') {
                        return React.cloneElement(child, {
                            ref: (el: HTMLElement) => el && registerTriggerElement(el)
                        });
                    }
                    if (child.props['data-role'] === 'target') {
                        return React.cloneElement(child, {
                            ref: (el: HTMLElement) => el && registerTargetElement(el)
                        });
                    }
                }
                return child;
            })}
        </div>
    );
};

export default BmPopOver;

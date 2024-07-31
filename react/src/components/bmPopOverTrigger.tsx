import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';

interface BmPopOverTriggerProps {
    autoclose: boolean;
}

const BmPopOverTrigger: React.FC<BmPopOverTriggerProps> = ({ autoclose, children }) => {
    const [isTargetOpen, setIsTargetOpen] = useState(false);
    const targetElements = useRef<HTMLElement[]>([]);
    const triggerElement = useRef<HTMLElement | null>(null);

    const hideTargetElements = () => {
        targetElements.current.forEach(el => $(el).hide());
    };

    const showTargetElements = () => {
        targetElements.current.forEach(el => $(el).show());
    };

    const docClickHandler = (event: MouseEvent) => {
        if (!autoclose) {
            return;
        }
        hideTargetElements();
        setIsTargetOpen(false);
        $(document).off('click', docClickHandler);
    };

    const handleTriggerClick = (event: React.MouseEvent) => {
        if (isTargetOpen) {
            setIsTargetOpen(false);
            hideTargetElements();
            $(document).off('click', docClickHandler);
        } else {
            $('.tooltip').hide();
            setIsTargetOpen(true);
            showTargetElements();
            $(document).on('click', docClickHandler);
            event.stopPropagation();
        }
    };

    useEffect(() => {
        const hideOrShowTargetElements = () => {
            if (isTargetOpen) {
                setIsTargetOpen(false);
                hideTargetElements();
            }
        };

        $(document).on('click', '.reg-wrapper', hideOrShowTargetElements);

        return () => {
            $(document).off('click', '.reg-wrapper', hideOrShowTargetElements);
            $(document).off('click', docClickHandler);
        };
    }, [isTargetOpen]);

    const registerTriggerElement = (element: HTMLElement) => {
        triggerElement.current = element;
        $(element).on('click', handleTriggerClick);
    };

    const registerTargetElement = (element: HTMLElement) => {
        $(element).hide();
        targetElements.current.push(element);
    };

    return (
        <div ref={registerTriggerElement}>
            {children}
        </div>
    );
};

export default BmPopOverTrigger;

import React, { useEffect, useState } from 'react';
import backlinkService from '../services/backlinkService';

interface BackLink {
    label: string;
    action?: () => void;
    url?: string;
    image?: string;
    icon?: string;
    state?: string;
    text?: string;
    requiredPrivilege?: string;
    accessKey?: string;
    id?: string;
    title?: string;
}

const BmBackLinks: React.FC = () => {
    const [backLinks, setBackLinks] = useState<BackLink[]>([]);

    useEffect(() => {
        const handleStateChangeSuccess = (event: any, state: any) => {
            if (state.data && state.data.backLinks) {
                backlinkService.setUrls(state.data.backLinks);
                setBackLinks(backlinkService.getAllUrls());
            }
        };

        setBackLinks(backlinkService.getAllUrls());

        // Assuming a global event bus or similar mechanism for state change events
        window.addEventListener('stateChangeSuccess', handleStateChangeSuccess);

        return () => {
            window.removeEventListener('stateChangeSuccess', handleStateChangeSuccess);
            window.onbeforeunload = undefined;
        };
    }, []);

    const closeAllDialogs = () => {

        // Assuming we have a global event bus or similar mechanism to close all dialogs
        const event = new CustomEvent('closeAllDialogs');
        window.dispatchEvent(event);

        event.preventDefault();
        const userConfirmed = window.confirm("Are you sure you want to proceed?");
        if (userConfirmed) {
            // Implement the logic to proceed with the action
        } else {
            // Implement the logic to cancel the action
        }
    };

    const displayConfirmationDialog = (event: React.MouseEvent) => {

        event.preventDefault();
        const userConfirmed = window.confirm("Are you sure you want to proceed?");
        if (userConfirmed) {
            // Implement the logic to proceed with the action
        } else {
            // Implement the logic to cancel the action
        }
    };

    return (
        <ul>
            {backLinks.map((backLink, index) => (
                <li key={index}>
                    {backLink.action && (
                        <a
                            className="back-btn"
                            accessKey={backLink.accessKey}
                            onClick={() => {
                                closeAllDialogs();
                                backLink.action && backLink.action();
                            }}
                            id={backLink.id}
                        >
                            <span dangerouslySetInnerHTML={{ __html: backLink.label }} />
                        </a>
                    )}
                    {backLink.url && (
                        <a
                            className={`back-btn ${backLink.image ? 'dashboard-link' : ''}`}
                            accessKey={backLink.accessKey}
                            href={backLink.url}
                            onClick={closeAllDialogs}
                            id={backLink.id}
                            title={backLink.title}
                        >
                            {backLink.image && <img src={backLink.image} onError={(e) => { e.currentTarget.src = '../images/blank-user.gif'; }} />}
                            {backLink.icon && !backLink.image && <i className={`fa ${backLink.icon}`} />}
                        </a>
                    )}
                    {backLink.state && !backLink.text && (
                        <a
                            className="back-btn"
                            accessKey={backLink.accessKey}
                            onClick={(e) => {
                                displayConfirmationDialog(e);
                                closeAllDialogs();
                            }}
                            id={backLink.id}
                        >
                            {backLink.icon && <i className={`fa ${backLink.icon}`} />}
                        </a>
                    )}
                    {backLink.text && backLink.requiredPrivilege && (
                        <a
                            accessKey={backLink.accessKey}
                            className="back-btn-noIcon"
                            id={backLink.id}
                            // SECOND AGENT: [MISSING CONTEXT] - Implement show-if-privilege logic
                        >
                            <span>{backLink.text}</span>
                        </a>
                    )}
                    {backLink.text && !backLink.requiredPrivilege && (
                        <a
                            accessKey={backLink.accessKey}
                            className="back-btn-noIcon"
                            id={backLink.id}
                        >
                            <span>{backLink.text}</span>
                        </a>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default BmBackLinks;

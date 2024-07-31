import React, { useState, useEffect } from 'react';
import useMessagingService from '../services/messagingService';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const MessageController: React.FC = () => {
    const { messages, hideMessages } = useMessagingService();
    const { t } = useTranslation();
    const history = useHistory();

    const getMessageText = (level: keyof typeof messages) => {
        let string = "";
        messages[level].forEach((message) => {
            string = string.concat(message.value);
        });
        const translatedMessage = t(string);

        navigator.clipboard.writeText(translatedMessage);

        return translatedMessage;
    };

    const isErrorMessagePresent = () => {
        return messages.error.length > 0;
    };

    const isInfoMessagePresent = () => {
        return messages.info.length > 0;
    };

    const isAlertMessagePresent = () => {
        return messages.alert.length > 0;
    };

    const discardChanges = (level: keyof typeof messages) => {

        // Handle state management and routing logic for discarding changes
        if (history.location.pathname.includes('patient/search')) {
            history.push('/default/patient/search');
        } else {
            const newPatientUuid = ''; // SECOND AGENT: [MISSING CONTEXT] - Retrieve newPatientUuid from appropriate state or props
            history.push(`/default/patient/${newPatientUuid}/dashboard`);
        }

            {Object.keys(messages).map((level) => (
                <div key={level}>
                    {messages[level].map((message, index) => (
                        <div key={index} className={`message ${level}`}>
                            {message.value}
                            <button onClick={() => hideMessages(level)}>Hide</button>
                        </div>
                    ))}
                </div>
            ))}

        hideMessages(level);

        if (isPatientSearch) {
            history.push('/default/patient/search');
        } else {
            history.push(`/default/patient/${newPatientUuid}/dashboard`);
        }
    };
        hideMessages(level);

        // Handle redirection logic based on state
        const isPatientSearch = history.location.pathname.includes('patient/search');
        const newPatientUuid = ''; // SECOND AGENT: [MISSING CONTEXT] - Retrieve newPatientUuid from appropriate state or props

        if (isPatientSearch) {

            {Object.keys(messages).map((level) => (
                <div key={level}>
                    {messages[level].map((message, index) => (
                        <div key={index} className={`message ${level}`}>
                            {message.value}
                            <button onClick={() => hideMessages(level)}>Hide</button>
                        </div>
                    ))}
                </div>
            ))}
            history.push(`/default/patient/${newPatientUuid}/dashboard`);
        }

    return (
        <div>
            {/* Render messages and controls here */}

            {Object.keys(messages).map((level) => (
                <div key={level}>
                    {messages[level].map((message, index) => (
                        <div key={index} className={`message ${level}`}>
                            {message.value}
                            <button onClick={() => hideMessages(level)}>Hide</button>
                        </div>
                    ))}
                </div>
            ))}
    );
};

export default MessageController;

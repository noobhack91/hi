import { useState, useEffect } from 'react';

interface Message {
    value: string;
    isServerError: boolean;
}

interface Messages {
    error: Message[];
    info: Message[];
    alert: Message[];
}

const useMessagingService = () => {
    const [messages, setMessages] = useState<Messages>({ error: [], info: [], alert: [] });

    const showMessage = (level: keyof Messages, message: string, errorEvent?: string) => {
        const messageObject: Message = { value: '', isServerError: false };
        messageObject.value = message ? message.replace(/\[|\]|null/g, '') : " ";
        if (errorEvent) {
            messageObject.isServerError = true;
            if (!messages[level].length) {
                createTimeout('error', 6000);
            }
        } else if (level === 'info') {
            createTimeout('info', 4000);
        }

        const index = messages[level].findIndex(msg => msg.value === messageObject.value);

        if (index >= 0) {
            messages[level].splice(index, 1);
        }
        if (messageObject.value) {
            setMessages(prevMessages => ({
                ...prevMessages,
                [level]: [...prevMessages[level], messageObject]
            }));
        }
    };

    const createTimeout = (level: keyof Messages, time: number) => {
        setTimeout(() => {
            setMessages(prevMessages => ({
                ...prevMessages,
                [level]: []
            }));
        }, time);
    };

    const hideMessages = (level: keyof Messages) => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [level]: []
        }));
    };

    const clearAll = () => {
        setMessages({ error: [], info: [], alert: [] });
    };

    return {
        messages,
        showMessage,
        hideMessages,
        clearAll
    };
};

export default useMessagingService;

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

class MessagingService {
    private messages: Messages;

    constructor() {
        this.messages = { error: [], info: [], alert: [] };
    }

    public showMessage(level: keyof Messages, message: string, errorEvent?: string): void {
        const messageObject: Message = { value: '', isServerError: false };
        messageObject.value = message ? message.replace(/\[|\]|null/g, '') : " ";
        if (errorEvent) {
            messageObject.isServerError = true;
            if (!this.messages[level].length) {
                this.createTimeout('error', 6000);
            }
        } else if (level === 'info') {
            this.createTimeout('info', 4000);
        }

        const index = this.messages[level].findIndex(msg => msg.value === messageObject.value);

        if (index >= 0) {
            this.messages[level].splice(index, 1);
        }
        if (messageObject.value) {
            this.messages[level].push(messageObject);
        }
    }

    private createTimeout(level: keyof Messages, time: number): void {
        setTimeout(() => {
            this.messages[level] = [];
        }, time);
    }

    public hideMessages(level: keyof Messages): void {
        this.messages[level].length = 0;
    }

    public clearAll(): void {
        this.messages.error = [];
        this.messages.info = [];
        this.messages.alert = [];
    }

    public getMessages(level: keyof Messages): Message[] {
        return this.messages[level];
    }
}

export const useMessagingService = () => {
    const [messagingService] = useState(new MessagingService());

    useEffect(() => {
        const handleServerError = (event: Event, errorMessage: string) => {
            messagingService.showMessage('error', errorMessage, 'serverError');
        };

        window.addEventListener('event:serverError', handleServerError as EventListener);

        return () => {
            window.removeEventListener('event:serverError', handleServerError as EventListener);
        };
    }, [messagingService]);

    return messagingService;
};

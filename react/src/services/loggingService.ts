import axios from 'axios';

interface ErrorDetails {
    message: string;
    stack?: string;
    [key: string]: any;
}

class LoggingService {
    log(errorDetails: ErrorDetails): void {
        axios.post('/log', errorDetails, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error logging to server:', error);
        });
    }
}

export default new LoggingService();

import useMessagingService from '../services/messagingService';
import loggingService from '../services/loggingService';

const logError = (exception: Error, cause?: string) => {
    try {
        const messagingService = useMessagingService();
        const errorMessage = exception.toString();
        const stackTrace = (exception.stack || '').split('\n');
        const errorDetails = {
            timestamp: new Date(),
            browser: navigator.userAgent,
            errorUrl: window.location.href,
            errorMessage: errorMessage,
            stackTrace: stackTrace,
            cause: (cause || "")
        };
        loggingService.log(errorDetails);
        messagingService.showMessage('error', errorMessage);
        exposeException(errorDetails);
    } catch (loggingError) {
        console.warn("Error logging failed");
        console.log(loggingError);
    }
};

const exposeException = (exceptionDetails: any) => {
    (window as any).angular_exception = (window as any).angular_exception || [];
    (window as any).angular_exception.push(exceptionDetails);
};

export default logError;

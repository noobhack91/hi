import axios, { AxiosResponse, AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showError } from '../utils/errorHandler'; // Assuming you have an error handler utility
import { serverErrorMessages } from '../utils/constants/serverErrorMessages'; // Assuming you have a constants file

const stringAfter = (value: string, searchString: string): string => {
    const indexOfFirstColon = value.indexOf(searchString);
    return value.substr(indexOfFirstColon + 1).trim();
};

const getServerError = (message: string): string => {
    return stringAfter(message, ':');
};

const shouldRedirectToLogin = (response: AxiosResponse): boolean => {
    const errorMessage = response.data.error ? response.data.error.message : response.data;
    return errorMessage.search("Session timed out") > 0;
};

const useHttpInterceptor = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                const response = error.response;
                const data = response?.data;
                const unexpectedError = "There was an unexpected issue on the server. Please try again";

                if (response?.status === 500) {
                    const errorMessage = data?.error?.message ? getServerError(data.error.message) : unexpectedError;
                    showError(dispatch, errorMessage);
                } else if (response?.status === 409) {
                    const errorMessage = data?.error?.message ? getServerError(data.error.message) : "Duplicate entry error";
                    showError(dispatch, errorMessage);
                } else if (response?.status === 0) {
                    showError(dispatch, "Could not connect to the server. Please check your connection and try again");
                } else if (response?.status === 405) {
                    showError(dispatch, unexpectedError);
                } else if (response?.status === 400) {
                    const errorMessage = data?.error?.message ? data.error.message : data?.error ? data.error : (data?.localizedMessage || "Could not connect to the server. Please check your connection and try again");
                    showError(dispatch, errorMessage);
                } else if (response?.status === 403) {
                    const errorMessage = data?.error?.message ? data.error.message : unexpectedError;
                    if (shouldRedirectToLogin(response)) {
                        dispatch({ type: 'AUTH_LOGIN_REQUIRED' });
                    } else {
                        showError(dispatch, errorMessage);
                    }
                } else if (response?.status === 404) {
                    if (!response.config.url.includes("implementation_config") && !response.config.url.includes("locale_") &&
                        !response.config.url.includes("offlineMetadata")) {
                        showError(dispatch, "The requested information does not exist");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(requestInterceptor);
        };
    }, [dispatch]);
};

export default useHttpInterceptor;

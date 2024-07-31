import axios from 'axios';
import { globalPropertyUrl, serverDateTimeUrl, loginText, localeLangs } from '../utils/constants';

class LocaleService {
    allowedLocalesList() {
        return axios.get(globalPropertyUrl, {
            params: {
                property: 'locale.allowed.list'
            },
            withCredentials: true,
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    defaultLocale() {
        return axios.get(globalPropertyUrl, {
            params: {
                property: 'default_locale'
            },
            withCredentials: true,
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    serverDateTime() {
        return axios.get(serverDateTimeUrl, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    getLoginText() {
        return axios.get(loginText, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    getLocalesLangs() {
        return axios.get(localeLangs, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }
}

export default new LocaleService();

import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

class LocaleService {
    allowedLocalesList() {
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
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
        return axios.get(BahmniCommonConstants.globalPropertyUrl, {
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
        return axios.get(BahmniCommonConstants.serverDateTimeUrl, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    getLoginText() {
        return axios.get(BahmniCommonConstants.loginText, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    getLocalesLangs() {
        return axios.get(BahmniCommonConstants.localeLangs, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }
}

export default new LocaleService();

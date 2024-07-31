import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

class UserService {
    async getUser(userName: string): Promise<any> {
        try {
            const response = await axios.get(BahmniCommonConstants.userUrl, {
                params: {
                    username: userName,
                    v: "custom:(username,uuid,person:(uuid,),privileges:(name,retired),userProperties)"
                },
                cache: false
            });
            return response.data;
        } catch (error) {
            throw new Error('Unable to get user data');
        }
    }

    async savePreferences(currentUser: any): Promise<void> {
        try {
            const user = currentUser.toContract();
            const response = await axios.post(`${BahmniCommonConstants.userUrl}/${user.uuid}`, {
                uuid: user.uuid,
                userProperties: user.userProperties
            }, {
                withCredentials: true
            });
            currentUser.userProperties = response.data.userProperties;
        } catch (error) {
            throw new Error('Unable to save user preferences');
        }
    }

    async getProviderForUser(uuid: string): Promise<any> {
        try {
            const response = await axios.get(BahmniCommonConstants.providerUrl, {
                params: {
                    user: uuid,
                    v: 'custom:(uuid,display,attributes)'
                },
                cache: false
            });
            if (response.data.results.length > 0) {
                const providerName = response.data.results[0].display.split("-")[1];
                response.data.results[0].name = providerName ? providerName.trim() : providerName;
                return response.data;
            } else {
                throw new Error("UNABLE_TO_GET_PROVIDER_DATA");
            }
        } catch (error) {
            throw new Error("UNABLE_TO_GET_PROVIDER_DATA");
        }
    }

    async getPasswordPolicies(): Promise<any> {
        try {
            const response = await axios.get(BahmniCommonConstants.passwordPolicyUrl, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw new Error('Unable to get password policies');
        }
    }

    async allowedDomains(): Promise<string[]> {
        try {
            const response = await axios.get(BahmniCommonConstants.loginConfig, {
                cache: true
            });
            return response.data.whiteListedDomains;
        } catch (error) {
            return [];
        }
    }
}

export default new UserService();

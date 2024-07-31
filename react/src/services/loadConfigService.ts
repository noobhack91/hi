import axios from 'axios';

class LoadConfigService {
    async loadConfig(url: string): Promise<any> {
        try {
            const response = await axios.get(url, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw new Error(`Error loading config: ${error.message}`);
        }
    }
}

export default new LoadConfigService();

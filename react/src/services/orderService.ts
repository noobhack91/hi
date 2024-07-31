import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

interface OrderData {
    conceptNames: string[];
    includeObs: boolean;
    patientUuid: string;
    numberOfVisits: number;
    obsIgnoreList?: string[];
    orderTypeUuid?: string;
    orderUuid?: string;
    visitUuid?: string;
    locationUuids?: string[];
}

class OrderService {
    async getOrders(data: OrderData) {
        const params: any = {
            concept: data.conceptNames,
            includeObs: data.includeObs,
            patientUuid: data.patientUuid,
            numberOfVisits: data.numberOfVisits
        };

        if (data.obsIgnoreList) {
            params.obsIgnoreList = data.obsIgnoreList;
        }
        if (data.orderTypeUuid) {
            params.orderTypeUuid = data.orderTypeUuid;
        }
        if (data.orderUuid) {
            params.orderUuid = data.orderUuid;
        }
        if (data.visitUuid) {
            params.visitUuid = data.visitUuid;
        }
        if (data.locationUuids && data.locationUuids.length > 0) {
            params.numberOfVisits = 0;
            params.locationUuids = data.locationUuids;
        }

        try {
            const response = await axios.get(BahmniCommonConstants.bahmniOrderUrl, {
                params: params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders', error);
            throw error;
        }
    }
}

export default new OrderService();

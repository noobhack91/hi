import axios from 'axios';

class OrderTypeService {
    private orderTypes: Array<{ uuid: string, display: string, conceptClasses: Array<{ uuid: string, display: string, name: string }> }> = [];

    async loadAll(): Promise<Array<{ uuid: string, display: string, conceptClasses: Array<{ uuid: string, display: string, name: string }> }>> {
        try {
            const response = await axios.get("/openmrs/ws/rest/v1/ordertype", {
                params: { v: "custom:(uuid,display,conceptClasses:(uuid,display,name))" }
            });
            this.orderTypes = response.data.results;
            return this.orderTypes;
        } catch (error) {
            console.error("Error loading order types", error);
            throw error;
        }
    }

    getOrderTypeUuid(orderTypeName: string): string | undefined {
        const orderType = this.orderTypes.find(orderType => orderType.display === orderTypeName);
        return orderType ? orderType.uuid : undefined;
    }
}

export default new OrderTypeService();

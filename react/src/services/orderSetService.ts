import axios from 'axios';

const ORDER_SET_URL = 'path/to/orderSetUrl'; // SECOND AGENT: [MISSING CONTEXT] - Define the actual URL for order sets
const CALCULATE_DOSE_URL = 'path/to/calculateDoseUrl'; // SECOND AGENT: [MISSING CONTEXT] - Define the actual URL for dose calculation

interface DoseResponse {
    value: number;
    doseUnit: string;
}

interface CalculatedDose {
    dose: number;
    doseUnit: string;
}

class OrderSetService {
    async getOrderSetsByQuery(name: string): Promise<any> {
        try {
            const response = await axios.get(ORDER_SET_URL, {
                params: {
                    v: "full",
                    s: "byQuery",
                    q: name
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching order sets: ${error}`);
        }
    }

    async getCalculatedDose(
        patientUuid: string,
        drugName: string,
        baseDose: number,
        doseUnit: string,
        orderSetName: string,
        dosingRule: string,
        visitUuid: string
    ): Promise<CalculatedDose> {
        if (dosingRule) {
            const requestString = JSON.stringify({
                patientUuid,
                drugName,
                baseDose,
                doseUnit,
                orderSetName,
                dosingRule,
                visitUuid
            });

            try {
                const response = await axios.get<DoseResponse>(CALCULATE_DOSE_URL, {
                    params: { dosageRequest: requestString },
                    withCredentials: true,
                    headers: { "Accept": "application/json", "Content-Type": "application/json" }
                });

                return {
                    dose: this.round(response.data.value),
                    doseUnit: response.data.doseUnit
                };
            } catch (error) {
                throw new Error(`Error calculating dose: ${error}`);
            }
        }

        return {
            dose: baseDose,
            doseUnit
        };
    }

    private round(value: number): number {
        const leastRoundableDose = 0.49;
        const leastPrescribableDose = 0.1;
        value = value <= leastRoundableDose ? value : Math.round(value);
        return value < leastPrescribableDose ? leastPrescribableDose : value;
    }
}

export default new OrderSetService();

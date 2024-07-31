import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

interface Condition {
    uuid: string;
    concept: any;
    conditionNonCoded: string;
    status: string;
    onSetDate: string | null;
    endDate: string | null;
    endReason: string;
    additionalDetail: string;
    voided: boolean;
    voidReason: string;
}

class ConditionsService {
    async save(conditions: Condition[], patientUuid: string) {
        const conditionsToBeSaved = conditions.filter(condition => condition.onSetDate !== null && !Number.isInteger(condition.onSetDate));
        const body = conditionsToBeSaved.map(condition => ({
            uuid: condition.uuid,
            patientUuid: patientUuid,
            concept: condition.concept,
            conditionNonCoded: condition.conditionNonCoded,
            status: condition.status,
            onSetDate: condition.onSetDate,
            endDate: condition.endDate,
            endReason: condition.endReason,
            additionalDetail: condition.additionalDetail,
            voided: condition.voided,
            voidReason: condition.voidReason
        }));

        return axios.post(BahmniCommonConstants.conditionUrl, body, {
            withCredentials: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
    }

    async getConditionHistory(patientUuid: string) {
        const params = { patientUuid: patientUuid };
        return axios.get(BahmniCommonConstants.conditionHistoryUrl, {
            params: params,
            headers: { withCredentials: true }
        });
    }

    async getFollowUpConditionConcept() {
        return axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
            params: {
                name: BahmniCommonConstants.followUpConditionConcept,
                v: "custom:(uuid,name:(name))"
            },
            cache: true
        });
    }

    private getLatestActiveCondition(conditionHistories: any[], latestCondition: any) {
        const conditionHistory = conditionHistories.find(history => 
            history.conceptUuid === latestCondition.concept.uuid && 
            history.conditionNonCoded === latestCondition.conditionNonCoded
        );
        return Bahmni.Common.Domain.Conditions.getPreviousActiveCondition(latestCondition, conditionHistory.conditions);
    }

    async getConditions(patientUuid: string) {
        const response = await this.getConditionHistory(patientUuid);
        const conditionHistories = response.data;
        const conditions = Bahmni.Common.Domain.Conditions.fromConditionHistories(conditionHistories);
        conditions.forEach(condition => {
            condition.activeSince = this.getLatestActiveCondition(conditionHistories, condition).onSetDate;
        });
        return conditions;
    }
}

export default new ConditionsService();

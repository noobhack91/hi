import _ from 'lodash';

interface Drug {
    uuid: string;
}

interface DrugOrder {
    drug?: Drug;
    drugNonCoded?: string;
    effectiveStartDate: Date;
}

class DrugOrderHistoryHelper {
    getInactiveDrugsFromPastVisit(activeAndScheduledDrugs: DrugOrder[], previousVisitDrugs: DrugOrder[]): DrugOrder[] {
        const inactivePreviousVisitDrugs: DrugOrder[] = [];
        _.each(previousVisitDrugs, (previousVisitDrug) => {
            const presentInActiveAndScheduledDrugs = _.find(activeAndScheduledDrugs, (activeAndScheduledDrug) => {
                if (activeAndScheduledDrug.drug && previousVisitDrug.drug) {
                    return activeAndScheduledDrug.drug.uuid === previousVisitDrug.drug.uuid;
                } else if (activeAndScheduledDrug.drugNonCoded && previousVisitDrug.drugNonCoded) {
                    return activeAndScheduledDrug.drugNonCoded === previousVisitDrug.drugNonCoded;
                }
                return false;
            });
            if (!presentInActiveAndScheduledDrugs) {
                inactivePreviousVisitDrugs.push(previousVisitDrug);
            }
        });
        return inactivePreviousVisitDrugs;
    }

    getRefillableDrugOrders(activeAndScheduledDrugOrders: DrugOrder[], previousVisitDrugOrders: DrugOrder[], showOnlyActive: boolean): DrugOrder[] {
        const drugOrderUtil = {
            sortDrugOrders: (drugOrders: DrugOrder[] = []): DrugOrder[] => {
                // Placeholder for sorting logic
                return drugOrders.sort((a, b) => a.effectiveStartDate.getTime() - b.effectiveStartDate.getTime());
            }
        };
        const now = new Date();
        const partitionedDrugOrders = _.groupBy(activeAndScheduledDrugOrders, (drugOrder) => {
            return (drugOrder.effectiveStartDate > now) ? "scheduled" : "active";
        });
        const sortedDrugOrders: DrugOrder[][] = [];

        sortedDrugOrders.push(drugOrderUtil.sortDrugOrders(partitionedDrugOrders.scheduled));
        sortedDrugOrders.push(drugOrderUtil.sortDrugOrders(partitionedDrugOrders.active));
        if (!showOnlyActive) {
            sortedDrugOrders.push(drugOrderUtil.sortDrugOrders(this.getInactiveDrugsFromPastVisit(activeAndScheduledDrugOrders, previousVisitDrugOrders)));
        }
        return _.flatten(sortedDrugOrders);
    }
}

export default DrugOrderHistoryHelper;

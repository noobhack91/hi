import axios from 'axios';
import { BahmniCommonConstants } from '../utils/constants/BahmniCommonConstants';

interface LabOrderResult {
    accessionDateTime: string;
    hasRange: boolean;
    minNormal?: number;
    maxNormal?: number;
    panelName?: string;
    testName?: string;
    orderName?: string;
    isPanel?: boolean;
    tests?: LabOrderResult[];
    accessionUuid?: string;
}

interface TabularResult {
    tabularResult: {
        orders: LabOrderResult[];
    };
}

interface TransformGroupSortResult {
    accessions: LabOrderResult[][];
    tabularResult: TabularResult;
}

class LabOrderResultService {
    private allTestsAndPanelsConcept: any = {};

    constructor() {
        this.loadConfigurations();
    }

    private async loadConfigurations() {
        try {
            const configurations = await axios.get(BahmniCommonConstants.conceptSearchByFullNameUrl, {
                params: {
                    v: 'custom:(uuid,name:(uuid,name),setMembers:(uuid,name:(uuid,name)))',
                    name: BahmniCommonConstants.allTestsAndPanelsConceptName
                },
                withCredentials: true
            });
            this.allTestsAndPanelsConcept = configurations.data.results[0];
        } catch (error) {
            console.error('Error fetching configurations:', error);
        }
    }

    private sanitizeData(labOrderResults: LabOrderResult[]) {
        labOrderResults.forEach(result => {
            result.accessionDateTime = new Date(result.accessionDateTime).toISOString();
            result.hasRange = !!(result.minNormal || result.maxNormal);
        });
    }

    private groupLabOrdersByPanel(labOrders: LabOrderResult[]): LabOrderResult[] {
        const panels: { [key: string]: LabOrderResult } = {};
        const accessionGroup: LabOrderResult[] = [];

        if (labOrders) {
            labOrders.forEach(labOrder => {
                if (!labOrder.panelName) {
                    labOrder.isPanel = false;
                    labOrder.orderName = labOrder.testName;
                    accessionGroup.push(labOrder);
                } else {
                    panels[labOrder.panelName] = panels[labOrder.panelName] || {
                        accessionDateTime: labOrder.accessionDateTime,
                        orderName: labOrder.panelName,
                        tests: [],
                        isPanel: true
                    };
                    panels[labOrder.panelName].tests!.push(labOrder);
                }
            });
        }

        Object.values(panels).forEach(value => {
            accessionGroup.push(value);
        });

        return accessionGroup;
    }

    private groupByPanel(accessions: LabOrderResult[][]): LabOrderResult[][] {
        const grouped: LabOrderResult[][] = [];
        accessions.forEach(labOrders => {
            grouped.push(this.groupLabOrdersByPanel(labOrders));
        });
        return grouped;
    }

    private flattened(accessions: LabOrderResult[][]): LabOrderResult[][] {
        return accessions.map(results => {
            return results.flatMap(result => result.isPanel ? [result, ...result.tests!] : result);
        });
    }

    private flattenedTabularData(results: LabOrderResult[]): LabOrderResult[] {
        return results.flatMap(result => result.isPanel ? [result, ...result.tests!] : result);
    }

    private transformGroupSort(
        results: any,
        initialAccessionCount: number,
        latestAccessionCount: number,
        sortResultColumnsLatestFirst: boolean,
        groupOrdersByPanel: boolean
    ): TransformGroupSortResult {
        const labOrderResults: LabOrderResult[] = results.results;
        this.sanitizeData(labOrderResults);

        const accessionConfig = {
            initialAccessionCount,
            latestAccessionCount
        };

        const tabularResult: TabularResult = new Bahmni.Clinical.TabularLabOrderResults(results.tabularResult, accessionConfig, sortResultColumnsLatestFirst);
        if (groupOrdersByPanel) {
            tabularResult.tabularResult.orders = this.groupLabOrdersByPanel(tabularResult.tabularResult.orders);
        }

        let accessions = Object.values(labOrderResults.reduce((acc, labOrderResult) => {
            acc[labOrderResult.accessionUuid!] = acc[labOrderResult.accessionUuid!] || [];
            acc[labOrderResult.accessionUuid!].push(labOrderResult);
            return acc;
        }, {} as { [key: string]: LabOrderResult[] }));

        accessions = accessions.sort((a, b) => new Date(a[0].accessionDateTime).getTime() - new Date(b[0].accessionDateTime).getTime());

        if (accessionConfig.initialAccessionCount || accessionConfig.latestAccessionCount) {
            const initial = accessions.slice(0, accessionConfig.initialAccessionCount || 0);
            const latest = accessions.slice(-accessionConfig.latestAccessionCount || 0);

            accessions = [...initial, ...latest];
        }

        accessions.reverse();

        return {
            accessions: this.groupByPanel(accessions),
            tabularResult
        };
    }

    public async getAllForPatient(params: any): Promise<any> {
        const paramsToBeSent: any = {};
        if (params.visitUuids) {
            paramsToBeSent.visitUuids = params.visitUuids;
        } else {
            if (!params.patientUuid) {
                throw new Error('patient uuid is mandatory');
            }
            paramsToBeSent.patientUuid = params.patientUuid;
            if (params.numberOfVisits !== 0) {
                paramsToBeSent.numberOfVisits = params.numberOfVisits;
            }
        }

        try {
            const response = await axios.get(Bahmni.Common.Constants.bahmniLabOrderResultsUrl, {
                params: paramsToBeSent,
                withCredentials: true
            });

            const results = this.transformGroupSort(response.data, params.initialAccessionCount, params.latestAccessionCount, params.sortResultColumnsLatestFirst, params.groupOrdersByPanel);
            const sortedConceptSet = new Bahmni.Clinical.ConceptWeightBasedSorter(this.allTestsAndPanelsConcept);
            results.tabularResult.tabularResult.orders = sortedConceptSet.sortTestResults(results.tabularResult.tabularResult.orders);

            const resultObject = {
                labAccessions: this.flattened(results.accessions.map(sortedConceptSet.sortTestResults)),
                tabular: results.tabularResult
            };

            if (params.groupOrdersByPanel) {
                resultObject.tabular.tabularResult.orders = this.flattenedTabularData(resultObject.tabular.tabularResult.orders);
            }

            return resultObject;
        } catch (error) {
            console.error('Error fetching lab order results:', error);
            throw error;
        }
    }
}

export default new LabOrderResultService();

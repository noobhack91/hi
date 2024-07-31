import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { configurations } from '../services/configurations';

interface Selectable {
    uuid: string;
    name: string;
    set: boolean;
    orderTypeName: string;
    isSelected: () => boolean;
    isSelectedFromSelf: () => boolean;
    select: () => void;
    addChild: (child: Selectable) => void;
}

interface Category {
    name: string;
    tests: Selectable[];
    filter: (filterFn: (selectable: Selectable) => boolean) => void;
}

interface Investigation {
    concept: { uuid: string; name: string; set: boolean };
    orderTypeUuid: string;
    voided: boolean;
}

interface InvestigationsSelectorProps {
    investigations: Investigation[];
    testsProvider: { getTests: () => Promise<any[]> };
    filterColumn: string;
    filterHeader: string;
    categoryColumn: string;
}

const InvestigationsSelector: React.FC<InvestigationsSelectorProps> = ({
    investigations,
    testsProvider,
    filterColumn,
    filterHeader,
    categoryColumn
}) => {
    const [selectablePanels, setSelectablePanels] = useState<Selectable[]>([]);
    const [selectableTests, setSelectableTests] = useState<Selectable[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [currentFilter, setCurrentFilter] = useState<string | null>(null);
    const [filteredPanels, setFilteredPanels] = useState<Selectable[]>([]);

    useEffect(() => {
        const fetchTests = async () => {
            const tests = await testsProvider.getTests();
            initializeTests(tests);
            selectSelectablesBasedOnInvestigations();
            showAll();
        };

        fetchTests();
    }, [testsProvider]);

    const onSelectionChange = (selectable: Selectable) => {
        if (selectable.isSelected()) {
            if (selectable.isSelectedFromSelf()) {
                addInvestigationForSelectable(selectable);
            }
        } else {
            removeInvestigationForSelectable(selectable);
        }
    };

    const initializeTests = (tests: any[]) => {
        const newCategories: Category[] = [];
        const newSelectablePanels: Selectable[] = [];
        const newSelectableTests: Selectable[] = [];
        const newFilters: string[] = [];

        tests.forEach(test => {
            const selectableTest = new Selectable(test, [], onSelectionChange);
            newSelectableTests.push(selectableTest);
            const categoryData = test[categoryColumn] || { name: "Other" };
            let category = newCategories.find(cat => cat.name === categoryData.name);

            if (category) {
                category.tests.push(selectableTest);
            } else {
                category = new Category(categoryData.name, [selectableTest]);
                newCategories.push(category);
            }

            test.panels.forEach(testPanel => {
                let selectablePanel = newSelectablePanels.find(panel => panel.name === testPanel.name);
                if (selectablePanel) {
                    selectablePanel.addChild(selectableTest);
                } else {
                    selectablePanel = new Selectable(testPanel, [selectableTest], onSelectionChange);
                    newSelectablePanels.push(selectablePanel);
                }
            });

            const filter = test[filterColumn];
            if (!newFilters.includes(filter)) {
                newFilters.push(filter);
            }
        });

        setCategories(newCategories);
        setSelectablePanels(newSelectablePanels);
        setSelectableTests(newSelectableTests);
        setFilters(newFilters);
    };

    const selectSelectablesBasedOnInvestigations = () => {
        const selectables = allSelectables();
        const currentInvestigations = investigations.filter(investigation => !investigation.voided);
        currentInvestigations.forEach(investigation => {
            const selectable = findSelectableForInvestigation(selectables, investigation);
            if (selectable) {
                selectable.select();
            }
        });
    };

    const findSelectableForInvestigation = (selectables: Selectable[], investigation: Investigation) => {
        return selectables.find(selectableConcept => selectableConcept.uuid === investigation.concept.uuid);
    };

    const createInvestigationFromSelectable = (selectable: Selectable): Investigation => {
        return {
            concept: { uuid: selectable.uuid, name: selectable.name, set: selectable.set },
            orderTypeUuid: configurations.encounterConfig().orderTypes[selectable.orderTypeName],
            voided: false
        };
    };

    const addInvestigationForSelectable = (selectable: Selectable) => {
        const investigation = findInvestigationForSelectable(selectable);
        if (investigation) {
            investigation.voided = false;
        } else {
            investigations.push(createInvestigationFromSelectable(selectable));
        }
    };

    const removeInvestigationForSelectable = (selectable: Selectable) => {
        const investigation = findInvestigationForSelectable(selectable);
        if (investigation) {
            removeInvestigation(investigation);
        }
    };

    const removeInvestigation = (investigation: Investigation) => {
        if (investigation.uuid) {
            investigation.voided = true;
        } else {
            const index = investigations.indexOf(investigation);
            investigations.splice(index, 1);
        }
    };

    const findInvestigationForSelectable = (selectable: Selectable) => {
        return investigations.find(investigation => investigation.concept.uuid === selectable.uuid);
    };

    const showAll = () => {
        filterBy(null);
    };

    const applyCurrentFilterByFilterColumn = (selectable: Selectable) => {
        return currentFilter ? selectable[filterColumn] === currentFilter : true;
    };

    const filterBy = (filter: string | null) => {
        setCurrentFilter(filter);
        setFilteredPanels(selectablePanels.filter(applyCurrentFilterByFilterColumn));
        categories.forEach(category => {
            category.filter(applyCurrentFilterByFilterColumn);
        });
    };

    const hasFilter = () => {
        return !!currentFilter;
    };

    const hasTests = () => {
        return selectableTests && selectableTests.length > 0;
    };

    const isFilteredBy = (filter: string) => {
        return currentFilter === filter;
    };

    const allSelectables = () => {
        return selectablePanels.concat(selectableTests);
    };

    const selectedSelectables = () => {
        return allSelectables().filter(selectable => selectable.isSelectedFromSelf());
    };

    return (
        <div>

            <div className="filter-header">
                <h4>{filterHeader}</h4>
                <div className="filters">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-button ${isFilteredBy(filter) ? 'active' : ''}`}
                            onClick={() => filterBy(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                    <button
                        className={`filter-button ${!hasFilter() ? 'active' : ''}`}
                        onClick={showAll}
                    >
                        Show All
                    </button>
                </div>
            </div>
            <div className="selectable-panels">
                {filteredPanels.map(panel => (
                    <div key={panel.uuid} className="panel">
                        <h5>{panel.name}</h5>
                        <div className="tests">
                            {panel.children.map(test => (
                                <div key={test.uuid} className="test">
                                    <input
                                        type="checkbox"
                                        checked={test.isSelected()}
                                        onChange={() => onSelectionChange(test)}
                                    />
                                    <label>{test.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="categories">
                {categories.map(category => (
                    <div key={category.name} className="category">
                        <h5>{category.name}</h5>
                        <div className="tests">
                            {category.tests.map(test => (
                                <div key={test.uuid} className="test">
                                    <input
                                        type="checkbox"
                                        checked={test.isSelected()}
                                        onChange={() => onSelectionChange(test)}
                                    />
                                    <label>{test.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestigationsSelector;

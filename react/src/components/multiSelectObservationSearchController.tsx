import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

interface Observation {
    selectedObs: any;
    getConceptUIConfig: () => any;
    getPossibleAnswers: () => any;
    toggleSelection: (item: any) => void;
}

interface MultiSelectObservationSearchControllerProps {
    observation: Observation;
}

const MultiSelectObservationSearchController: React.FC<MultiSelectObservationSearchControllerProps> = ({ observation }) => {
    const [possibleAnswers, setPossibleAnswers] = useState<any[]>([]);
    const [unselectedValues, setUnselectedValues] = useState<any[]>([]);
    const [values, setValues] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            const selectedValues = _.map(_.values(observation.selectedObs), 'value');
            _.remove(selectedValues, _.isUndefined);
            const initialValues = selectedValues.map((observation: any) => ({
                label: observation.name,
                name: observation.name
            }));
            setValues(initialValues);

            const configuredConceptSetName = observation.getConceptUIConfig().answersConceptName;
            if (!_.isUndefined(configuredConceptSetName)) {
                try {
                    const response = await axios.get(`/openmrs/ws/rest/v1/concept`, {
                        params: {
                            name: configuredConceptSetName,
                            v: "bahmni"
                        }
                    });
                    const answers = _.isEmpty(response.data.results) ? [] : response.data.results[0].answers;
                    setPossibleAnswers(answers);
                    setUnselectedValues(_.xorBy(answers, initialValues, 'uuid'));
                } catch (error) {
                    console.error('Error fetching concept:', error);
                }
            } else {
                const answers = observation.getPossibleAnswers();
                setPossibleAnswers(answers);
                setUnselectedValues(_.xorBy(answers, selectedValues, 'uuid'));
            }
        };

        init();
    }, [observation]);

    const search = (query: string) => {
        const matchingAnswers: any[] = [];
        unselectedValues.forEach((answer) => {
            if (typeof answer.name !== "object" && answer.name.toLowerCase().includes(query.toLowerCase())) {
                answer.label = answer.name;
                matchingAnswers.push(answer);
            } else if (typeof answer.name === "object" && answer.name.name.toLowerCase().includes(query.toLowerCase())) {
                answer.name = answer.name.name;
                answer.label = answer.name;
                matchingAnswers.push(answer);
            } else {
                const synonyms = _.map(answer.names, 'name');
                _.find(synonyms, (name) => {
                    if (name.toLowerCase().includes(query.toLowerCase())) {
                        answer.label = `${name} => ${answer.name}`;
                        matchingAnswers.push(answer);
                    }
                });
            }
        });
        return _.uniqBy(matchingAnswers, 'uuid');
    };

    const addItem = (item: any) => {
        setUnselectedValues(unselectedValues.filter(value => value.uuid !== item.uuid));
        observation.toggleSelection(item);
    };

    const removeItem = (item: any) => {
        setUnselectedValues([...unselectedValues, item]);
        observation.toggleSelection(item);
    };

    const setLabel = (answer: any) => {
        answer.label = answer.name;
        return true;
    };

    const removeFreeTextItem = () => {
        const value = (document.querySelector("input.input") as HTMLInputElement).value;
        if (_.isEmpty(search(value))) {
            (document.querySelector("input.input") as HTMLInputElement).value = "";
        }
    };

    return (
        <div>

            <input 
                type="text" 
                className="input" 
                placeholder="Search..." 
                onChange={(e) => {
                    const query = e.target.value;
                    const results = search(query);
                    // Handle the search results as needed
                }} 
            />
            <ul>
                {values.map((value) => (
                    <li key={value.name}>
                        {value.label}
                        <button onClick={() => removeItem(value)}>Remove</button>
                    </li>
                ))}
            </ul>
            <ul>
                {unselectedValues.map((value) => (
                    <li key={value.uuid}>
                        {value.label}
                        <button onClick={() => addItem(value)}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MultiSelectObservationSearchController;

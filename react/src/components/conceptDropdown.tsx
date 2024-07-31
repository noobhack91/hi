import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Concept {
    shortName?: string;
    name: { name: string } | string;
    uuid: string;
}

interface SearchResult {
    label: string;
    value: string;
    concept: Concept;
    uuid: string;
    name: string;
}

interface ConceptDropdownProps {
    selectedAnswer: SearchResult | null;
    answersConceptName?: string;
    defaultConcept: string;
    onChange: (selectedAnswer: SearchResult | null) => void;
    onInvalidClass?: string;
    isValid: boolean;
    ngDisabled: boolean;
}

const constructSearchResult = (concept: Concept): SearchResult => {
    const conceptName = concept.shortName || (typeof concept.name === 'string' ? concept.name : concept.name.name);
    return {
        label: conceptName,
        value: conceptName,
        concept: concept,
        uuid: concept.uuid,
        name: conceptName
    };
};

const find = (allAnswers: SearchResult[], savedAnswer: SearchResult | null): SearchResult | undefined => {
    return allAnswers.find(answer => savedAnswer && (savedAnswer.uuid === answer.concept.uuid));
};

const ConceptDropdown: React.FC<ConceptDropdownProps> = ({
    selectedAnswer,
    answersConceptName,
    defaultConcept,
    onChange,
    onInvalidClass,
    isValid,
    ngDisabled
}) => {
    const [answers, setAnswers] = useState<SearchResult[]>([]);
    const [selected, setSelected] = useState<SearchResult | null>(selectedAnswer);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                let results;
                if (!answersConceptName && defaultConcept) {
                    const response = await axios.get(`/api/concept/${defaultConcept}/answers`);
                    results = response.data;
                } else {
                    const response = await axios.get(`/api/concept/answers`, {
                        params: { answersConceptName }
                    });
                    results = response.data;
                }
                const searchResults = results.map(constructSearchResult);
                setAnswers(searchResults);
                setSelected(find(searchResults, selected));
            } catch (error) {
                console.error('Error fetching concept answers:', error);
            }
        };

        fetchAnswers();
    }, [answersConceptName, defaultConcept, selected]);

    useEffect(() => {
        onChange(selected);
    }, [selected, onChange]);

    return (
        <div className={`concept-dropdown ${onInvalidClass} ${isValid ? '' : 'invalid'}`}>
            <select
                disabled={ngDisabled}
                value={selected ? selected.uuid : ''}
                onChange={(e) => {
                    const selectedUuid = e.target.value;
                    const selectedAnswer = answers.find(answer => answer.uuid === selectedUuid) || null;
                    setSelected(selectedAnswer);
                }}
            >
                {answers.map(answer => (
                    <option key={answer.uuid} value={answer.uuid}>
                        {answer.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ConceptDropdown;

import React, { useEffect, useRef } from 'react';

interface ObsConstraintsProps {
    obs: {
        concept: {
            conceptClass: string;
            dataType: string;
            hiNormal?: number;
            lowNormal?: number;
        };
        primaryObs?: {
            concept: {
                conceptClass: string;
                dataType: string;
                hiNormal?: number;
                lowNormal?: number;
            };
        };
        conceptUIConfig?: {
            allowFutureDates?: boolean;
        };
    };
}

const attributesMap: { [key: string]: string } = {
    'Numeric': 'number',
    'Date': 'date',
    'Datetime': 'datetime'
};

const ObsConstraints: React.FC<ObsConstraintsProps> = ({ obs }) => {
    const elementRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const attributes: { [key: string]: any } = {};
        let obsConcept = obs.concept;

        if (obsConcept.conceptClass === 'conceptDetailsClassName') {
            obsConcept = obs.primaryObs?.concept || obsConcept;
        }

        attributes['type'] = attributesMap[obsConcept.dataType] || 'text';

        if (attributes['type'] === 'number') {
            attributes['step'] = 'any';
        }
        if (obsConcept.hiNormal) {
            attributes['max'] = obsConcept.hiNormal;
        }
        if (obsConcept.lowNormal) {
            attributes['min'] = obsConcept.lowNormal;
        }
        if (attributes['type'] === 'date') {
            if (!obs.conceptUIConfig?.allowFutureDates) {
                attributes['max'] = new Date().toISOString().split('T')[0];
            }
        }

        if (elementRef.current) {
            Object.keys(attributes).forEach(key => {
                elementRef.current?.setAttribute(key, attributes[key]);
            });
        }
    }, [obs]);

    return <input ref={elementRef} />;
};

export default ObsConstraints;

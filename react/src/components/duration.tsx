import React, { useState, useEffect } from 'react';
import ContextChangeHandler from '../services/contextChangeHandler';

interface DurationProps {
    hours: number;
    illegalValue: boolean;
    disabled: boolean;
    onChange: (value: number) => void;
}

const Duration: React.FC<DurationProps> = ({ hours, illegalValue, disabled, onChange }) => {
    const [measureValue, setMeasureValue] = useState<number | undefined>(undefined);
    const [unitValue, setUnitValue] = useState<number | undefined>(undefined);
    const [units, setUnits] = useState<{ [key: string]: number }>({});
    const [displayUnits, setDisplayUnits] = useState<Array<{ name: string; value: number }>>([]);
    const [illegalDurationValue, setIllegalDurationValue] = useState<boolean>(illegalValue);

    useEffect(() => {
        const valueAndUnit = convertToUnits(hours);
        setUnits(valueAndUnit.allUnits);
        setMeasureValue(valueAndUnit.value);
        setUnitValue(valueAndUnit.unitValueInMinutes);
        const durations = Object.keys(valueAndUnit.allUnits).reverse();
        setDisplayUnits(durations.map(duration => ({ name: duration, value: valueAndUnit.allUnits[duration] })));
    }, [hours]);

    useEffect(() => {
        const setValue = () => {
            if (unitValue && measureValue) {
                const value = unitValue * measureValue;
                onChange(value);
            } else {
                onChange(undefined);
            }
        };

        setValue();
    }, [measureValue, unitValue, onChange]);

    useEffect(() => {
        if (disabled) {
            setUnitValue(undefined);
            setMeasureValue(undefined);
        }
    }, [disabled]);

    useEffect(() => {
        const contextChange = () => ({ allow: !illegalDurationValue });
        ContextChangeHandler.add(contextChange);
        return () => {
            setIllegalDurationValue(false);
        };
    }, [illegalDurationValue]);

    return (
        <span>
            <input
                tabIndex={1}
                style={{ float: 'left' }}
                type="number"
                min="0"
                className={`duration-value ${illegalValue ? 'illegalValue' : ''}`}
                value={measureValue}
                onChange={(e) => setMeasureValue(Number(e.target.value))}
                disabled={disabled}
            />
            <select
                tabIndex={1}
                className={`duration-unit ${illegalValue ? 'illegalValue' : ''}`}
                value={unitValue}
                onChange={(e) => setUnitValue(Number(e.target.value))}
                disabled={disabled}
            >
                <option value=""></option>
                {displayUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                        {unit.name}
                    </option>
                ))}
            </select>
        </span>
    );
};

// Utility function to convert hours to units
const convertToUnits = (hours: number) => {

    const allUnits = {
        minutes: 1,
        hours: 60,
        days: 1440,
        weeks: 10080
    };

    let value = hours * 60; // Convert hours to minutes
    let unitValueInMinutes = 1;

    if (value >= allUnits.weeks) {
        unitValueInMinutes = allUnits.weeks;
    } else if (value >= allUnits.days) {
        unitValueInMinutes = allUnits.days;
    } else if (value >= allUnits.hours) {
        unitValueInMinutes = allUnits.hours;
    } else {
        unitValueInMinutes = allUnits.minutes;
    }

    return {
        allUnits,
        value,
        unitValueInMinutes
    };
};
    return {
        allUnits: {},
        value: 0,
        unitValueInMinutes: 0,
    };
};

export default Duration;

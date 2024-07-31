import React, { useState, useEffect } from 'react';

// Assuming DateUtil is a utility that needs to be imported. 
// Import paths should be relative to the current file path.
import { DateUtil } from '../utils/DateUtil';

interface DateConverterProps {
    value: string;
    onChange: (date: string) => void;
}

const DateConverter: React.FC<DateConverterProps> = ({ value, onChange }) => {
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        if (value) {
            const parsedDate = DateUtil.parse(DateUtil.getDateWithoutTime(value));
            setDate(parsedDate);
        }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = event.target.value;
        const parsedDate = DateUtil.parse(inputDate);
        setDate(parsedDate);
        onChange(parsedDate);
    };

    return (
        <input
            type="text"
            value={date}
            onChange={handleChange}
        />
    );
};

export default DateConverter;

import React, { useState, useEffect } from 'react';
import moment from 'moment';

interface DateTimePickerProps {
    model: string;
    observation: { disabled: boolean };
    showTime: boolean;
    illegalValue: boolean;
    allowFutureDates: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ model, observation, showTime, illegalValue, allowFutureDates }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<string | undefined>(undefined);
    const [currentModel, setCurrentModel] = useState<string>(model);

    useEffect(() => {
        if (!allowFutureDates) {
            setMaxDate(moment().format('YYYY-MM-DD'));
        }
        if (model) {
            const date = moment(model).toDate();
            setSelectedDate(date);
            setSelectedTime(date);
            updateModel(date, date);
        }
    }, [model, allowFutureDates]);

    const getSelectedDateStr = (date: Date | null) => {
        return date ? moment(date).format('YYYY-MM-DD') : '';
    };

    const getSelectedTimeStr = (time: Date | null) => {
        return time ? moment(time).format('HH:mm') : '';
    };

    const valueNotFilled = () => {
        return selectedDate == null && selectedTime == null;
    };

    const valueCompletelyFilled = () => {
        return selectedDate != null && selectedTime != null;
    };

    const updateModel = (date: Date | null, time: Date | null) => {
        if (valueCompletelyFilled()) {
            setCurrentModel(getSelectedDateStr(date) + ' ' + getSelectedTimeStr(time));
        } else if (!isValid()) {
            setCurrentModel('Invalid Datetime');
        } else {
            setCurrentModel('');
        }
    };

    const isValid = () => {
        return valueNotFilled() || valueCompletelyFilled();
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value ? new Date(event.target.value) : null;
        setSelectedDate(date);
        updateModel(date, selectedTime);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value ? new Date(`1970-01-01T${event.target.value}:00`) : null;
        setSelectedTime(time);
        updateModel(selectedDate, time);
    };

    return (
        <div>
            <div>
                <input
                    type="date"
                    onChange={handleDateChange}
                    className={illegalValue ? 'illegalValue' : ''}
                    max={maxDate}
                    value={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}
                    disabled={observation.disabled}
                />
            </div>
            {showTime && (
                <div>
                    <input
                        type="time"
                        onChange={handleTimeChange}
                        className={!isValid() ? 'illegalValue' : ''}
                        value={selectedTime ? moment(selectedTime).format('HH:mm') : ''}
                        disabled={observation.disabled}
                    />
                </div>
            )}
        </div>
    );
};

export default DateTimePicker;

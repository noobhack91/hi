import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';

interface DatePickerProps {
    maxDate?: string;
    minDate?: string;
    dateFormat?: string;
    onSelect: (dateText: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ maxDate, minDate = "-120y", dateFormat = 'dd-mm-yyyy', onSelect }) => {
    const datepickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (datepickerRef.current) {
            $(datepickerRef.current).datepicker({
                changeYear: true,
                changeMonth: true,
                maxDate: maxDate,
                minDate: minDate,
                yearRange: 'c-120:c+120',
                dateFormat: dateFormat,
                onSelect: function (dateText: string) {
                    onSelect(dateText);
                }
            });
        }

        return () => {
            if (datepickerRef.current) {
                $(datepickerRef.current).datepicker('destroy');
            }
        };
    }, [maxDate, minDate, dateFormat, onSelect]);

    return <input type="text" ref={datepickerRef} />;
};

export default DatePicker;

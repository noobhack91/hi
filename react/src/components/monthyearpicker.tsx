import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface MonthYearPickerProps {
    observation?: any;
    minYear?: number;
    maxYear?: number;
    illegalValue?: boolean;
    model?: string;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ minYear, maxYear, illegalValue, model }) => {
    const { t } = useTranslation();
    const [monthNames, setMonthNames] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [years, setYears] = useState<number[]>([]);
    const [internalModel, setInternalModel] = useState<string | undefined>(model);

    useEffect(() => {
        const monthNamesTranslated = t('MONTHS').split(",");
        setMonthNames(monthNamesTranslated);
    }, [t]);

    useEffect(() => {
        const getYearList = () => {
            const currentYear = moment().year();
            const min = minYear ?? currentYear - 15;
            const max = maxYear ?? currentYear + 5;
            const yearList = [];
            for (let i = max; i >= min; i--) {
                yearList.push(i);
            }
            return yearList;
        };
        setYears(getYearList());
    }, [minYear, maxYear]);

    useEffect(() => {
        if (model) {
            const date = moment(model).toDate();
            setSelectedMonth(date.getMonth());
            setSelectedYear(date.getFullYear());
        }
    }, [model]);

    const valueCompletelyFilled = () => selectedMonth !== null && selectedYear !== null;
    const valueNotFilled = () => selectedMonth === null && selectedYear === null;

    const getCompleteDate = () => {
        const month = (selectedMonth ?? 0) + 1;
        return `${selectedYear}-${month}-01`;
    };

    const updateModel = () => {
        if (valueCompletelyFilled()) {
            setInternalModel(getCompleteDate());
        } else if (!isValid()) {
            setInternalModel("Invalid Date");
        } else {
            setInternalModel("");
        }
    };

    const isValid = () => valueNotFilled() || valueCompletelyFilled();

    const illegalMonth = () => (selectedMonth === undefined || selectedMonth === null) && (selectedYear !== null && selectedYear !== undefined);
    const illegalYear = () => (selectedMonth !== null && selectedMonth !== undefined) && (selectedYear === undefined || selectedYear === null);

    return (
        <span>
            <select
                value={selectedMonth ?? ''}
                className={illegalMonth() || illegalValue ? 'illegalValue' : ''}
                onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value, 10));
                    updateModel();
                }}
            >
                <option value="">{t('CHOOSE_MONTH_KEY')}</option>
                {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                ))}
            </select>
            <select
                value={selectedYear ?? ''}
                className={illegalYear() || illegalValue ? 'illegalValue' : ''}
                onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value, 10));
                    updateModel();
                }}
            >
                <option value="">{t('CHOOSE_YEAR_KEY')}</option>
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </span>
    );
};

export default MonthYearPicker;

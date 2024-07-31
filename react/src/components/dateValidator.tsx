import React, { useEffect } from 'react';

interface VisitDate {
    startDatetime?: string;
    stopDatetime?: string;
}

interface DateValidatorProps {
    newVisit: VisitDate;
    isNewVisitDateValid: () => boolean;
    onValidationChange: (isValid: boolean) => void;
}

const DateUtil = {
    getDate: (dateString: string) => new Date(dateString)
};

const DateValidator: React.FC<DateValidatorProps> = ({ newVisit, isNewVisitDateValid, onValidationChange }) => {
    const isVisitDateFromFuture = (visitDate: VisitDate) => {
        if (!visitDate.startDatetime && !visitDate.stopDatetime) {
            return false;
        }
        return (DateUtil.getDate(visitDate.startDatetime) > new Date() || (DateUtil.getDate(visitDate.stopDatetime) > new Date()));
    };

    const isStartDateBeforeEndDate = (visitDate: VisitDate) => {
        if (!visitDate.startDatetime || !visitDate.stopDatetime) {
            return true;
        }
        return (DateUtil.getDate(visitDate.startDatetime) <= DateUtil.getDate(visitDate.stopDatetime));
    };

    useEffect(() => {
        const isValid = isNewVisitDateValid() && !isVisitDateFromFuture(newVisit) && isStartDateBeforeEndDate(newVisit);
        onValidationChange(isValid);
    }, [newVisit, isNewVisitDateValid, onValidationChange]);

    return null;
};

export default DateValidator;

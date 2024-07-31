import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';

const birthDateToAgeText = (birthDate: Date | string): string => {
    if (!birthDate) {
        return "";
    }

    const birthDateObj = new Date(birthDate);
    const now = new Date();

    const years = formatDistanceToNowStrict(birthDateObj, { unit: 'year', locale: enUS });
    const months = formatDistanceToNowStrict(birthDateObj, { unit: 'month', locale: enUS });
    const days = formatDistanceToNowStrict(birthDateObj, { unit: 'day', locale: enUS });

    let ageInString = "";

    if (years !== '0 years') {
        ageInString += `${years} `;
    }
    if (months !== '0 months') {
        ageInString += `${months} `;
    }
    if (days !== '0 days') {
        ageInString += `${days} `;
    }

    return ageInString.trim();
};

export default birthDateToAgeText;

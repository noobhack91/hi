import { format } from 'date-fns';

// Utility function to calculate the difference in years, months, and days
function diffInYearsMonthsDays(birthDate: Date, referenceDate: Date): { years: number, months: number, days: number } {
    const years = referenceDate.getFullYear() - birthDate.getFullYear();
    const months = referenceDate.getMonth() - birthDate.getMonth();
    const days = referenceDate.getDate() - birthDate.getDate();

    let adjustedYears = years;
    let adjustedMonths = months;
    let adjustedDays = days;

    if (days < 0) {
        adjustedMonths -= 1;
        adjustedDays += new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
        adjustedYears -= 1;
        adjustedMonths += 12;
    }

    return { years: adjustedYears, months: adjustedMonths, days: adjustedDays };
}

// Function to get the current date
function now(): Date {
    return new Date();
}

// Main function to convert date to age
export function dateToAge(birthDate: Date, referenceDate: Date = now()): string {
    const age = diffInYearsMonthsDays(birthDate, referenceDate);
    return formatAge(age);
}

// Helper function to format the age
function formatAge(age: { years: number, months: number, days: number }): string {
    const parts = [];
    if (age.years > 0) parts.push(`${age.years} year${age.years > 1 ? 's' : ''}`);
    if (age.months > 0) parts.push(`${age.months} month${age.months > 1 ? 's' : ''}`);
    if (age.days > 0) parts.push(`${age.days} day${age.days > 1 ? 's' : ''}`);
    return parts.join(', ');
}

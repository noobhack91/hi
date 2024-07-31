import { TFunction } from 'i18next';

interface Age {
    years?: number;
    months?: number;
    days?: number;
}

const requiredAgeToShowCompletedYears = 5;

export function formatAge(age: Age, t: TFunction): string {
    if (age.years !== undefined) {
        if (age.years < requiredAgeToShowCompletedYears) {
            return (age.years ? age.years + " " + t("CLINICAL_YEARS_TRANSLATION_KEY") : "") +
                   (age.months ? " " + age.months + " " + t("CLINICAL_MONTHS_TRANSLATION_KEY") : "");
        }
        return age.years + " " + t("CLINICAL_YEARS_TRANSLATION_KEY");
    }
    if (age.months !== undefined) {
        return age.months + " " + t("CLINICAL_MONTHS_TRANSLATION_KEY");
    }
    return age.days + " " + t("CLINICAL_DAYS_TRANSLATION_KEY");
}

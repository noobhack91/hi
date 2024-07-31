import { TFunction } from 'i18next';

/**
 * Translates the title based on the provided input object.
 * 
 * @param input - The input object containing possible translation keys.
 * @param t - The translation function from i18next.
 * @returns The translated title or the appropriate fallback.
 */
export function titleTranslate(input: any, t: TFunction): string {
    if (!input) {
        return input;
    }
    if (input.translationKey) {
        return t(input.translationKey);
    }
    if (input.dashboardName) {
        return input.dashboardName;
    }
    if (input.title) {
        return input.title;
    }
    if (input.label) {
        return input.label;
    }
    if (input.display) {
        return input.display;
    }
    return t(input);
}

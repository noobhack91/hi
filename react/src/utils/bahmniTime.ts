// Import necessary utilities from Bahmni Common Util
import { DateUtil } from 'bahmni-common-util';

// Function to format time using Bahmni Common Util
export function bahmniTime(date: Date): string {
    return DateUtil.formatTime(date);
}

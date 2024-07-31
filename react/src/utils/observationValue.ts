// Import the necessary module for mapping observation values
import { ObservationValueMapper } from 'path/to/Bahmni/Common/Domain/ObservationValueMapper';

/**
 * Utility function to map observation values.
 * 
 * @param obs - The observation object to be mapped.
 * @returns The mapped observation value.
 */
export function observationValue(obs: any): any {
    return ObservationValueMapper.map(obs);
}

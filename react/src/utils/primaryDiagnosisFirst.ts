// react/src/utils/primaryDiagnosisFirst.ts

import _ from 'lodash';

interface Diagnosis {
    isPrimary: () => boolean;
}

export function primaryDiagnosisFirst(diagnoses: Diagnosis[]): Diagnosis[] {
    const primaryDiagnoses = _.filter(diagnoses, (diagnosis) => diagnosis.isPrimary());
    const otherDiagnoses = _.filter(diagnoses, (diagnosis) => !diagnosis.isPrimary());
    return primaryDiagnoses.concat(otherDiagnoses);
}

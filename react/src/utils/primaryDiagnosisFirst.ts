// react/src/utils/primaryDiagnosisFirst.ts

interface Diagnosis {
    isPrimary: () => boolean;
}

export function primaryDiagnosisFirst(diagnoses: Diagnosis[]): Diagnosis[] {
    const primaryDiagnoses = diagnoses.filter(diagnosis => diagnosis.isPrimary());
    const otherDiagnoses = diagnoses.filter(diagnosis => !diagnosis.isPrimary());
    return primaryDiagnoses.concat(otherDiagnoses);
}

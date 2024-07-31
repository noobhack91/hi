// react/src/utils/constants/careSetting.ts

export const careSetting = {
    inPatient: "INPATIENT",
    outPatient: "OUTPATIENT"
} as const;

export type CareSetting = keyof typeof careSetting;

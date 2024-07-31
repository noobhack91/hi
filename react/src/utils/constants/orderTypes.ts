// TypeScript constant for React components converted from AngularJS

export const orderTypes = {
    lab: "Lab Order",
    radiology: "Radiology Order"
} as const;

export type OrderTypes = keyof typeof orderTypes;

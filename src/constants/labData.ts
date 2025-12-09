export const LAB_PARAMETERS = [
    { label: 'Glucose', unit: 'mg/dl' },
    { label: 'Cholesterin', unit: 'mg/dl' },
    { label: 'LDL', unit: 'mg/dl' },
    { label: 'HDL', unit: 'mg/dl' },
    { label: 'HbA1c', unit: '%' },
    { label: 'CRP', unit: 'mg/l' },
    { label: 'Kreatinin', unit: 'mg/dl' },
] as const;

export type ParameterName = typeof LAB_PARAMETERS[number]['label'];

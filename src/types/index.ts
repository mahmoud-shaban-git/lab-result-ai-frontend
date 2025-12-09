export type Gender = 'male' | 'female' | 'MALE' | 'FEMALE';

export type RiskLevel = 'NORMAL' | 'LEICHT ERHÖHT' | 'KRITISCH';

export interface LabResultRequest {
    parameter: string;
    value: number;
    unit: string;
    age: number;
    gender: Gender;
}

export interface LabResultResponse {
    parameter: string;
    explanation: string;
    riskLevel: RiskLevel;
    recommendation: string;
    timestamp?: string;
}

export interface AnalysisHistory {
    id: string; // unique ID for key
    request: LabResultRequest;
    response: LabResultResponse;
    date: string;
}

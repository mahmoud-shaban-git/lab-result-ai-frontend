import type { LabResultRequest, LabResultResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/lab-results/explain';

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const explainLabResult = async (data: LabResultRequest): Promise<LabResultResponse> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new ApiError(`Serverfehler: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie, ob das Backend läuft.');
    }
};

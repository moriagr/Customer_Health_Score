export type HealthCategory = 'At Risk' | 'Middle' | 'Healthy';

export function categorizeCustomer(score: number): HealthCategory {
    if (score < 50) return 'At Risk';
    if (score < 75) return 'Middle';
    return 'Healthy';
}

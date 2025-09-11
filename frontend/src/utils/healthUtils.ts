export type HealthCategory = 'At Risk' | 'Middle' | 'Healthy';

export function categorizeCustomer(score: number): HealthCategory {
    if (score < 40) return 'At Risk';
    if (score <= 70) return 'Middle';
    return 'Healthy';
}

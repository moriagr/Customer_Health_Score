// Feature Adoption calculations

// export function calcFeatureAdoption(features: Set<unknown>, totalFeatures = 10): number {
//     if (totalFeatures === 0) return 0;
//     return (features.size / totalFeatures) * 100;
// }

// Generic score function (also used by login, API, etc.)
export function calcScore(current: number, previous: number): number {
    if (current === 0) return 0;
    if (previous === 0) return 100;
    return Math.min(100, (current / previous) * 100);
}

export function categorize(score: number | string) {
    if (Number(score) < 50) return "At Risk";
    if (Number(score) < 75) return "Middle";
    return "Healthy";
}

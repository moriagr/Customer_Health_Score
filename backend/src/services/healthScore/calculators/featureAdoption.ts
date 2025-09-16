
import {logger} from "../../../utils/logger";

// Generic score function (also used by login, API, etc.)
export function calcScore(current: number, previous: number): number {
    if (current === 0) return 0;
    if (previous === 0) return 100;
    const score = Math.min(100, (current / previous) * 100);
    logger.info("Calculated score for API / login / Feature_use ", score);

    return score;
}

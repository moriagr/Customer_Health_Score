import {logger} from "../../utils/logger";

export function categorize(score: number | string) {
  const category = Number(score) < 50 ? "At Risk" : Number(score) < 75 ? "Middle" : "Healthy";
  logger.info("Categorized score", { score, category });
  return category;
}

export { categorize } from "./utils";
export { /*calcFeatureAdoption,*/ calcScore } from "./calculators/featureAdoption";
export { convertIntoCurrentAndPrev } from "./calculators/loginAndApi";
export { separateSupportTickets, calcSupportScore } from "./calculators/support";
export { calcPaymentScore } from "./calculators/payments";
export { calculateCustomerScore, calculateDetailed, calculate } from "./aggregator";

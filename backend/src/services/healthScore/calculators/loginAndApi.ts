import { currEvent } from "../../../type/healthScoreType";

// Reuse calcScore from featureAdoption
import { calcScore } from "./featureAdoption";

export function convertIntoCurrentAndPrev(events: currEvent[]) {
    let loginsCurrent = 0, loginsPrev = 0;
    let featuresCurrent = 0, featuresPrev = 0;
    let apiCurrent = 0, apiPrev = 0;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    events.forEach((event) => {
        const eventDate = new Date(event.created_at);

        if (event.event_type === "login") {
            if (eventDate >= oneMonthAgo) loginsCurrent += 1;
            else if (eventDate >= twoMonthsAgo) loginsPrev += 1;
        } else if (event.event_type === "feature_use") {
            if (eventDate >= oneMonthAgo) featuresCurrent += 1;
            else if (eventDate >= twoMonthsAgo) featuresPrev += 1;
        } else if (event.event_type === "api_call") {
            if (eventDate >= oneMonthAgo) apiCurrent += 1;
            else if (eventDate >= twoMonthsAgo) apiPrev += 1;
        }
    });

    return { loginsCurrent, loginsPrev, featuresCurrent, featuresPrev, apiCurrent, apiPrev };
}

export { calcScore };

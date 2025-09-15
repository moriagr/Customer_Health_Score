import React, { useMemo } from 'react';
import { COLORS } from '../../utils/colors';
import { categorizeCustomer } from '../../utils/healthUtils';

interface Props {
    score: number | undefined;
}

export const PresentScore: React.FC<Props> = ({ score }) => {
    const category = useMemo(() => {
        if (score === undefined) return undefined;

        return categorizeCustomer(score);
    }, [score]);

    if (!score) {
        return <p>Health Score: N/A</p>
    }

    return <p style={{ color: COLORS[category || 'Healthy'] }}>Health Score: {score} % {`(${category})`}</p>

};

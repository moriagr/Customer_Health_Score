import React from 'react';
import { Customer } from '../../types/customer';
import { Card } from '../UI/Card';
import { ProgressBar } from '../UI/ProgressBar';
import { COLORS } from '../../utils/colors';
import { categorizeCustomer } from '../../utils/healthUtils';

interface Props {
    topCustomers: Customer[];
    onSelectCustomer: (id: number) => void;
}

export const TopAtRisk: React.FC<Props> = ({ topCustomers, onSelectCustomer }) => {

    return (<>
            <h3>Top 5 Most At Risk Customers:</h3>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'center' }}>
            {topCustomers.length > 0 ? topCustomers.map(c => (
                <Card key={c.id} style={{ cursor: 'pointer', width: 220 }} onClick={() => onSelectCustomer(c.id)}>
                    <h4>{c.name}</h4>
                    {c.score}
                    <ProgressBar value={Number(c.score)} color={COLORS[categorizeCustomer(c.score)]} />
                </Card>
            )) : null}
        </div>
    </>
    );
};

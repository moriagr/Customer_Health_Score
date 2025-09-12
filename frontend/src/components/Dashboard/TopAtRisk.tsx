import React from 'react';
import { Customer } from '../../types/customer';
import { Card } from '../UI/Card';
import { ProgressBar } from '../UI/ProgressBar';
import { COLORS } from '../../utils/colors';
import { categorizeCustomer } from '../../utils/healthUtils';

interface Props {
    customers: Customer[];
    onSelectCustomer: (id: number) => void;
}

export const TopAtRisk: React.FC<Props> = ({ customers, onSelectCustomer }) => {
    const sorted = [...customers].sort((a, b) => a.healthScore - b.healthScore).slice(0, 5);

    return (
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'center' }}>
            {sorted.map(c => (
                <Card key={c.id} style={{ cursor: 'pointer', width: 220 }} onClick={() => onSelectCustomer(c.id)}>
                    <h4>{c.name}</h4>
                    <ProgressBar value={c.healthScore} color={COLORS[categorizeCustomer(c.healthScore)]} />
                </Card>
            ))}
        </div>
    );
};

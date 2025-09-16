import React from 'react';
import { Card } from '../UI/Card';
import { ProgressBar } from '../UI/ProgressBar';
import { COLORS } from '../../utils/colors';
import { categorizeCustomer } from '../../utils/healthUtils';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

interface Props {
    onSelectCustomer: (id: number) => void;
}

export const TopAtRisk: React.FC<Props> = ({ onSelectCustomer }) => {
    const { topAtRisk, customers } = useSelector(
        (state: RootState) => state.customers
    );
    return (
        <>
            <h3>Top 5 Most At Risk Customers:</h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'center' }}>
                {topAtRisk.length > 0 ? topAtRisk.map((id: number) => (
                    <Card key={id} style={{ cursor: 'pointer', width: 220 }} onClick={() => onSelectCustomer(id)}>
                        <h4>{customers.data[id].name}</h4>
                        {customers.data[id].score}
                        <ProgressBar value={Number(customers.data[id].score)} color={COLORS[categorizeCustomer(customers.data[id].score)]} />
                    </Card>
                )) : null}
            </div>
        </>
    );
};

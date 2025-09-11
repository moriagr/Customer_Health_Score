import React from 'react';
import { Customer } from '../../types/customer';
import { Card } from '../UI/Card';

interface Props {
    customers: Customer[];
    onSelectCustomer: (id: number) => void;
    onBack: () => void;
}

export const CustomerList: React.FC<Props> = ({ customers, onSelectCustomer, onBack }) => {
    return (
        <div style={{ padding: 20 }}>
            <button onClick={onBack}>Back</button>
            {customers.map(c => (
                <Card key={c.id} style={{ margin: 10, cursor: 'pointer' }} onClick={() => onSelectCustomer(c.id)}>
                    <h4>{c.name}</h4>
                    <p>Segment: {c.segment}</p>
                    <p>Health Score: {c.healthScore}</p>
                </Card>
            ))}
        </div>
    );
};

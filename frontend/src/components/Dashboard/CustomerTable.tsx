import React, { useCallback, useEffect } from 'react';
import { Customer } from '../../types/customer';
import { Card } from '../UI/Card';
import { fetchCustomers } from '../../services/api';
import { DataStateHandler } from '../Layout/DataStateHandler';
import { PresentScore } from '../UI/PresentScore';

interface Props {
    onSelectCustomer: (id: number) => void;
    onBack: () => void;
}

export const CustomerList: React.FC<Props> = ({ onSelectCustomer, onBack }) => {
    const [allCustomers, setCustomers] = React.useState<Customer[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const getData = useCallback(() => {
        setLoading(true);
        setError("");
        fetchCustomers().then((val) => {
            setCustomers(val);
            setLoading(false);
        }).catch((err) => {
            setError(err.message || "Failed to load customers");
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <DataStateHandler loading={loading} error={error} goBack={onBack} tryAgain={getData} isEmpty={!allCustomers || allCustomers.length <= 0} emptyMessage="No customer data available.">

            {allCustomers.map(c => (
                <Card key={c.id} style={{ margin: 10, cursor: 'pointer' }} onClick={() => onSelectCustomer(c.id)}>
                    <h4>{c.name}</h4>
                    <p>Segment: {c.segment}</p>
                    <PresentScore score={c.score} />
                </Card>
            ))}
        </DataStateHandler>
    );
};

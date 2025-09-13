import React, { useEffect } from 'react';
import { Customer } from '../../types/customer';
import { Card } from '../UI/Card';
import { fetchCustomers } from '../../services/api';
import { Loading } from '../UI/Loading';
import { ErrorBox } from '../UI/ErrorBox';

interface Props {
    onSelectCustomer: (id: number) => void;
    onBack: () => void;
}

export const CustomerList: React.FC<Props> = ({ onSelectCustomer, onBack }) => {
    const [allCustomers, setCustomers] = React.useState<Customer[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    useEffect(() => {
        setLoading(true);
        fetchCustomers().then((val) => {
            setCustomers(val);
            setLoading(false);
        }).catch((err) => {
            setError(err.message || "Failed to load customers");
            setLoading(false);
        });
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <button onClick={onBack}>Back</button>
            {loading ?
                <Loading /> :
                error ?
                    <ErrorBox error={error} /> :

                    allCustomers.length > 0 ?
                        allCustomers.map(c => (
                            <Card key={c.id} style={{ margin: 10, cursor: 'pointer' }} onClick={() => onSelectCustomer(c.id)}>
                                <h4>{c.name}</h4>
                                <p>Segment: {c.segment}</p>
                                <p>Health Score: {c.score}</p>
                            </Card>
                        ))
                        : <div>No customers found.</div>}
        </div>
    );
};

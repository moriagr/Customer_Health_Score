import React, { useEffect } from 'react';
import { Card } from '../UI/Card';
import { loadCustomers } from '../../services/api';
import { DataStateHandler } from '../Layout/DataStateHandler';
import { PresentScore } from '../UI/PresentScore';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';

interface Props {
    onSelectCustomer: (id: number) => void;
    onBack: () => void;
}

export const CustomerList: React.FC<Props> = ({ onSelectCustomer, onBack }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { loading, customers, error } = useSelector(
        (state: RootState) => state.customers
    );

    useEffect(() => {
        dispatch(loadCustomers());
    }, [dispatch]);

    return (
        <DataStateHandler loading={loading} error={error} goBack={onBack} tryAgain={() => dispatch(loadCustomers())} isEmpty={Object.values(customers)?.length <= 0} emptyMessage="No customer data available.">

            {Object.values(customers.data).map(customer => (
                <Card key={customer.id} style={{ margin: 10, cursor: 'pointer' }} onClick={() => onSelectCustomer(customer.id)}>
                    <h4>{customer.name}</h4>
                    <p>Segment: {customer.segment}</p>
                    <PresentScore score={customer.score} />
                </Card>
            ))}
        </DataStateHandler>
    );
};

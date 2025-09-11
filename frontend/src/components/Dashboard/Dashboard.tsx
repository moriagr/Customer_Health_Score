import React, { useEffect, useState } from 'react';
import { fetchCustomers } from '../../services/customerApi';
import { Customer } from '../../types/customer';
import { TopAtRisk } from './TopAtRisk';
import { HealthPieChart } from './HealthPieChart';
import { CustomerList } from './CustomerTable';
import { CustomerDetail } from './CustomerCard';

export const Dashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchCustomers().then(setCustomers);
    }, []);

    const handleSelectCustomer = (id: number) => {
        setSelectedCustomerId(id);
    };

    if (selectedCustomerId) {
        return <CustomerDetail customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} />;
    }

    if (showAll) {
        return <CustomerList customers={customers} onSelectCustomer={handleSelectCustomer} onBack={() => setShowAll(false)} />;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Customer Health Dashboard</h1>
            <TopAtRisk customers={customers} onSelectCustomer={handleSelectCustomer}/>
            <button onClick={() => setShowAll(true)}>View All Customers</button>
            <HealthPieChart customers={customers} />
        </div>
    );
};

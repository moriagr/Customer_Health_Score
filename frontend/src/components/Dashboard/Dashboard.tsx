import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../../services/api';
import { Customer, DashboardSummary } from '../../types/customer';
import { TopAtRisk } from './TopAtRisk';
import { HealthPieChart } from './HealthPieChart';
import { CustomerList } from './CustomerTable';
import { CustomerDetail } from './CustomerCard';
import { Loading } from '../UI/Loading';
import { ErrorBox } from '../UI/ErrorBox';

export const Dashboard: React.FC = () => {
    const [topAtRisk, setTopAtRisk] = useState<Customer[]>([]);
    const [summary, setSummary] = useState<DashboardSummary>();
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchDashboardData()
            .then(handleSplitToArrays)
            .catch((err) => {
                setError(err.message || "Failed to load dashboard data");
                setLoading(false);
            }).finally(() => setLoading(false));
    }, []);

    const handleSplitToArrays = (body: { topAtRisk: Customer[], summary: DashboardSummary }) => {
        setTopAtRisk(body.topAtRisk || [])
        setSummary(body.summary)
    }



    const handleSelectCustomer = (id: number) => {
        setSelectedCustomerId(id);
    };

    if(loading){
        return <Loading />;
    }
    // if(error){
    //     return <ErrorBox error={error} tryAgain={} />;
    // }

    if (selectedCustomerId) {
        return <CustomerDetail customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} />;
    }

    if (showAll) {
        return <CustomerList onSelectCustomer={handleSelectCustomer} onBack={() => setShowAll(false)} />;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Customer Health Dashboard</h1>
            <TopAtRisk topCustomers={topAtRisk} onSelectCustomer={handleSelectCustomer} />
            <button onClick={() => setShowAll(true)}>View All Customers</button>
            <HealthPieChart summary={summary} />
        </div>
    );
};
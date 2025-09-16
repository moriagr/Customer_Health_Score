import React, { useEffect, useState } from 'react';
import { loadDashboard } from '../../services/api';
import { PieData } from '../../types/customer';
import { TopAtRisk } from './TopAtRisk';
import { GenericPieChart } from './HealthPieChart';
import { CustomerList } from './CustomerTable';
import { CustomerDetail } from './CustomerDetail';
import { Loading } from '../UI/Loading';
import { ErrorBox } from '../UI/ErrorBox/index';
import { CustomButton } from '../UI/CustomButton/Index';
import { HealthCategory } from '../../utils/healthUtils';
import { COLORS } from '../../utils/colors';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { summary, loading, error } = useSelector(
        (state: RootState) => state.customers
    );
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        dispatch(loadDashboard());
    }, [dispatch]);


    const handleSelectCustomer = (id: number) => {
        setSelectedCustomerId(id);
    };

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <ErrorBox error={error} tryAgain={() => { dispatch(loadDashboard()) }} />;
    }

    if (selectedCustomerId) {
        return <CustomerDetail customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} />;
    }

    if (showAll) {
        return <CustomerList onSelectCustomer={handleSelectCustomer} onBack={() => setShowAll(false)} />;
    }
    let data: PieData[] = [];

    if (summary && summary.data && Object.keys(summary.data).length > 0) {
        const { total_customers, ...categoryCounts } = summary.data;
        const total = total_customers || 0;


        data = (Object.keys(categoryCounts) as HealthCategory[]).map((cat) => ({
            name: cat,
            value: categoryCounts[cat],
            percentage: total ? ((categoryCounts[cat] / total) * 100).toFixed(1) : "0",
        }));
    }
    return (
        <div style={{ padding: 20 }}>
            <h1>Customer Health Dashboard</h1>
            <TopAtRisk onSelectCustomer={handleSelectCustomer} />
            <CustomButton onClickFunc={() => setShowAll(true)} text={"View All Customers"} />
            {data ? <GenericPieChart total={summary?.data?.total_customers} data={data} text="Customer Health" colors={COLORS} /> : <></>}
        </div>
    );
};
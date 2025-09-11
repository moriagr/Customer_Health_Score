import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Customer } from "../../types/customer";
import { categorizeCustomer, HealthCategory } from "../../utils/healthUtils";

interface Props {
    customers: Customer[];
}

const COLORS: Record<HealthCategory, string> = {
    'At Risk': "#e74c3c",   // red
    Middle: "#f1c40f",     // yellow
    Healthy: "#2ecc71",     // green
};

type PieData = {
    name: string;
    value: number;
    percentage: string;
};


export const HealthPieChart: React.FC<Props> = ({ customers }) => {
    // Count customers by category
    const counts: Record<HealthCategory, number> = {
        'At Risk': 0,
        Middle: 0,
        Healthy: 0,
    };

    customers.forEach((c) => {
        const cat = categorizeCustomer(c.healthScore);
        counts[cat]++;
    });

    const total = customers.length;

    const data: PieData[] = (Object.keys(counts) as HealthCategory[]).map((cat) => ({
        name: cat,
        value: counts[cat],
        percentage: total ? ((counts[cat] / total) * 100).toFixed(1) : "0",
    }));

    const renderLabel = (props: { percent: number }) =>
        `${(props.percent * 100).toFixed(1)}%`;

    return (
        <div style={{ width: "100%", height: 350, display: "flex" }}>
            {/* Pie Chart */}
            <ResponsiveContainer width="70%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={renderLabel as any} // 👈 cast avoids TS error, safe for Recharts
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as HealthCategory]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, _, props) => [`${value}`, props?.payload?.name]} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend menu on the side */}
            <div style={{ width: "30%", paddingLeft: 16 }}>
                <h4>Customer Health</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {data.map((entry) => (
                        <li key={entry.name} style={{ marginBottom: 8 }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    backgroundColor: COLORS[entry.name as HealthCategory],
                                    marginRight: 8,
                                }}
                            />
                            {entry.name} — {entry.percentage}%
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

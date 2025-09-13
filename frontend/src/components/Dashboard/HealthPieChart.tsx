import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { DashboardSummary } from "../../types/customer";
import { HealthCategory } from "../../utils/healthUtils";
import { COLORS } from "../../utils/colors";

interface Props {
    summary: DashboardSummary | undefined;
}

type PieData = {
    name: string;
    value: number;
    percentage: string;
};


export const HealthPieChart: React.FC<Props> = ({ summary }) => {
    // Count customers by category
    if (!summary) {
        return <div>No data available</div>
    }
    const { total_customers, ...categoryCounts } = summary;
    const total = total_customers || 0;

    const data: PieData[] = (Object.keys(categoryCounts) as HealthCategory[]).map((cat) => ({
        name: cat,
        value: categoryCounts[cat],
        percentage: total ? ((categoryCounts[cat] / total) * 100).toFixed(1) : "0",
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

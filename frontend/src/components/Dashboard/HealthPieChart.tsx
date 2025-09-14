import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface PieChartItem {
    name: string;
    value: number;
}

interface Props {
    data: PieChartItem[];               // data to display
    colors: Record<string, string>;     // color mapping for each slice
    total?: number;                     // optional total for percentage calculation
    text: string;                       // title/legend header
}

export const GenericPieChart: React.FC<Props> = ({ data, colors, total, text }) => {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    const computedTotal = total || data.reduce((acc, item) => acc + item.value, 0);

    const dataWithPercentages = data.map((item) => ({
        ...item,
        percentage: ((item.value / computedTotal) * 100).toFixed(1),
    }));

    const renderLabel = (props: { percent: number }) =>
        `${(props.percent * 100).toFixed(1)}%`;

    return (
        <div style={{ width: "100%", height: 350, display: "flex" }}>
            {/* Pie Chart */}
            <ResponsiveContainer width="70%" height="100%">
                <PieChart>
                    <Pie
                        data={dataWithPercentages}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={renderLabel as any} // Recharts type workaround
                    >
                        {dataWithPercentages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, _, props) => [`${value}`, props?.payload?.name]} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ width: "30%", paddingLeft: 16, justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <h4>{text}</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {dataWithPercentages.map((entry) => (
                        <li key={entry.name} style={{ marginBottom: 8 }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    backgroundColor: colors[entry.name],
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

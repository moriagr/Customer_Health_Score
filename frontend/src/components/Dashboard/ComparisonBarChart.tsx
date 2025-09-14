import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  lastMonth: {
    logins: number;
    features: number;
    apiCalls: number;
  };
  thisMonth: {
    logins: number;
    features: number;
    apiCalls: number;
  };
}

const CustomerComparisonChart: React.FC<Props> = ({ lastMonth, thisMonth }) => {
  const data = [
    { metric: 'Login frequency', LastMonth: lastMonth.logins, ThisMonth: thisMonth.logins },
    { metric: 'Feature adoption rate', LastMonth: lastMonth.features, ThisMonth: thisMonth.features },
    { metric: 'API usage trends', LastMonth: lastMonth.apiCalls, ThisMonth: thisMonth.apiCalls },
  ];

  return (
    <div style={{ width: '100%', height: 300, marginBottom: 30 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="LastMonth" fill="#8884d8" />
          <Bar dataKey="ThisMonth" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerComparisonChart;

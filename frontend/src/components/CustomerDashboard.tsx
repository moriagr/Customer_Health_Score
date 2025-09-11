// import React, { useEffect, useState } from 'react';
// import { getDashboardData } from '../services/api';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// export default function CustomerDashboard() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getDashboardData().then(setData);
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial' }}>
//       <h1>Customer Health Dashboard</h1>

//       <div style={{ marginBottom: '20px' }}>
//         <p>Total Customers: {data.totalCustomers}</p>
//         <p>Healthy Customers: {data.healthyCustomers}</p>
//         <p>At-Risk Customers: {data.atRiskCustomers}</p>
//       </div>

//       <h2>All Customers Health Scores</h2>
//       <BarChart width={700} height={400} data={data.customers}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis domain={[0, 100]} />
//         <Tooltip />
//         <Bar dataKey="healthScore" fill="#82ca9d" />
//       </BarChart>
//     </div>
//   );
// }
export {}; // Temporary export to avoid isolatedModules error
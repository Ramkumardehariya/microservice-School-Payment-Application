// src/components/Charts/TransactionChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionChart = ({ data }) => {
  // Process data for the chart
  const chartData = Object.entries(data).map(([date, values]) => ({
    date,
    success: values.success || 0,
    pending: values.pending || 0,
    failed: values.failed || 0,
  }));

  return (
    <div className="card h-80">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Transactions Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" fill="#10b981" name="Successful" />
          <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
          <Bar dataKey="failed" fill="#ef4444" name="Failed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
// src/components/Charts/TransactionChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionChart = ({ data }) => {
  // Process data for the chart
  console.log("data hai: ", data);

if (!Array.isArray(data)) {
  console.error("Expected data to be an array of transactions");
  return [];
}

const grouped = data.reduce((acc, transaction) => {
  const status = (transaction.status?.[0] || "").toLowerCase();
  const date = new Date(transaction.payment_time?.[0] || transaction.createdAt)
    .toISOString()
    .split("T")[0]; // YYYY-MM-DD format

  if (!acc[date]) {
    acc[date] = { success: 0, pending: 0, failed: 0 };
  }

  if (status === "success") acc[date].success += 1;
  else if (status === "pending") acc[date].pending += 1;
  else acc[date].failed += 1;

  return acc;
}, {});

// Now convert to chart-friendly array
const chartData = Object.entries(grouped).map(([date, values]) => ({
  date,
  success: values.success,
  pending: values.pending,
  failed: values.failed,
}));

console.log("Chart Data: ", chartData);

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
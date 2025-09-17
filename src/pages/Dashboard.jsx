// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionChart from '../components/Charts/TransactionChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    failed: 0
  });
  
  const { data, isLoading } = useTransactions(1, 1000); // Get all transactions for stats

  useEffect(() => {
    if (data?.data?.transactions) {
      const transactions = data.data.transactions;
      const total = transactions.length;
      const success = transactions.filter(t => t.status === 'success').length;
      const pending = transactions.filter(t => t.status === 'pending').length;
      const failed = transactions.filter(t => t.status === 'failed' || t.status === 'cancelled').length;
      
      setStats({ total, success, pending, failed });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const StatCard = ({ title, value, color, secondary }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-full ${color}`}>
          {/* Icon would go here */}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {secondary && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{secondary}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Transactions" 
          value={stats.total} 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Successful" 
          value={stats.success} 
          color="bg-green-100 text-green-600"
          secondary={`${stats.total ? ((stats.success / stats.total) * 100).toFixed(1) : 0}%`}
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          color="bg-yellow-100 text-yellow-600"
          secondary={`${stats.total ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%`}
        />
        <StatCard 
          title="Failed" 
          value={stats.failed} 
          color="bg-red-100 text-red-600"
          secondary={`${stats.total ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}%`}
        />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <TransactionChart data={data?.data?.transactions || []} />
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {data?.data?.transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.collect_id}>
                  <td className="table-cell">{transaction.custom_order_id}</td>
                  <td className="table-cell">{formatCurrency(transaction.transaction_amount)}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    {new Date(transaction.payment_time).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
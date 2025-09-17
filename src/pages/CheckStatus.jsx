// src/pages/CheckStatus.jsx
import { useState } from 'react';
import { useTransactionStatus } from '../hooks/useTransactions';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';

const CheckStatus = () => {
  const [orderId, setOrderId] = useState('');
  const { data, isLoading, refetch } = useTransactionStatus(orderId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId) {
      refetch();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: 'bg-green-100 text-green-800', label: 'Success' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Check Transaction Status</h2>
      
      <form onSubmit={handleSubmit} className="card mb-6">
        <div className="mb-4">
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order ID
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID (e.g., ORD123...)"
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading || !orderId}>
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="medium" />
        </div>
      )}

      {data?.data && !isLoading && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{data.data.order_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1">{getStatusBadge(data.data.status)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatCurrency(data.data.transaction_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Mode</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{data.data.payment_mode || 'N/A'}</dd>
            </div>
            {data.data.payment_time && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Time</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(data.data.payment_time)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {data?.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{data.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
// src/components/Transactions/TransactionTable.jsx
import { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionTable = ({ transactions, loading, onSort, sortField, sortOrder }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
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

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer dark:text-gray-400"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        {sortField === field && (
          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="table-header">
            <tr>
              <SortableHeader field="collect_id">ID</SortableHeader>
              <SortableHeader field="school_id">School</SortableHeader>
              <SortableHeader field="gateway">Gateway</SortableHeader>
              <SortableHeader field="order_amount">Order Amount</SortableHeader>
              <SortableHeader field="transaction_amount">Transaction Amount</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="custom_order_id">Order ID</SortableHeader>
              <SortableHeader field="payment_time">Payment Time</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <>
                <tr 
                  key={transaction.collect_id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleRow(transaction.collect_id)}
                >
                  <td className="table-cell">
                    {transaction.collect_id}
                  </td>
                  <td className="table-cell">
                    {transaction.school_id?.name || transaction.school_id}
                  </td>
                  <td className="table-cell">
                    {transaction.gateway}
                  </td>
                  <td className="table-cell">
                    {formatCurrency(transaction.order_amount)}
                  </td>
                  <td className="table-cell">
                    {formatCurrency(transaction.transaction_amount)}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="table-cell">
                    {transaction.custom_order_id}
                  </td>
                  <td className="table-cell">
                    {transaction.payment_time ? formatDate(transaction.payment_time) : '-'}
                  </td>
                  <td className="table-cell">
                    <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                {expandedRow === transaction.collect_id && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan="9" className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transaction Details</h4>
                          <dl className="space-y-1">
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Transaction ID:</dt>
                              <dd className="text-gray-900 dark:text-white">{transaction.collect_id}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Order ID:</dt>
                              <dd className="text-gray-900 dark:text-white">{transaction.custom_order_id}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Gateway:</dt>
                              <dd className="text-gray-900 dark:text-white">{transaction.gateway}</dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Information</h4>
                          <dl className="space-y-1">
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Order Amount:</dt>
                              <dd className="text-gray-900 dark:text-white">{formatCurrency(transaction.order_amount)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Transaction Amount:</dt>
                              <dd className="text-gray-900 dark:text-white">{formatCurrency(transaction.transaction_amount)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500 dark:text-gray-400">Status:</dt>
                              <dd>{getStatusBadge(transaction.status)}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
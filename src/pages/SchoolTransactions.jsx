// src/pages/SchoolTransactions.jsx
import { useState } from 'react';
import { useSchoolTransactions } from '../hooks/useTransactions';
import TransactionTable from '../components/Transactions/TransactionTable';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useSchools } from '../hooks/useSchools'; // Import the custom hook

const SchoolTransactions = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [page, setPage] = useState(1);
  
  const { schools, isLoading: schoolsLoading, error: schoolsError } = useSchools(); // Use the custom hook
  const { data: transactionsData, isLoading: transactionsLoading } = 
    useSchoolTransactions(selectedSchool, page, 10);

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">School Transactions</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select School
        </label>
        <select
          value={selectedSchool}
          onChange={handleSchoolChange}
          className="input-field"
          disabled={schoolsLoading}
        >
          <option value="">Select a school</option>
          {schools.map(school => (
            <option key={school._id} value={school._id}>
              {school.name}
            </option>
          ))}
        </select>
        
        {schoolsLoading && (
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <LoadingSpinner className="h-4 w-4 animate-spin mr-2" />
            Loading schools...
          </div>
        )}
        
        {schoolsError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{schoolsError}</p>
        )}
      </div>

      {schoolsLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      )}

      {selectedSchool && (
        <>
          <TransactionTable 
            transactions={transactionsData?.data?.transactions || []} 
            loading={transactionsLoading}
            onSort={() => {}}
            sortField=""
            sortOrder=""
          />
          
          {/* Pagination */}
          {transactionsData?.data?.pagination && transactionsData.data.pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * 10, transactionsData.data.pagination.total)}
                </span>{' '}
                of <span className="font-medium">{transactionsData.data.pagination.total}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === transactionsData.data.pagination.pages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolTransactions;
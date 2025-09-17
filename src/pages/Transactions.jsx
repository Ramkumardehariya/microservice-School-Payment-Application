// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useSchools } from '../hooks/useSchools';
import TransactionTable from '../components/Transactions/TransactionTable';
import Filters from '../components/Transactions/Filters';
// src/pages/Transactions.jsx
// Add this import

// Replace the schoolsData line with:
import SearchBar from '../components/UI/SearchBar';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Transactions = () => {
  // const { data: schools, isLoading: schoolsLoading } = useSchools();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortField, setSortField] = useState(searchParams.get('sort') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') ? searchParams.get('status').split(',') : [],
    schools: searchParams.get('schools') ? searchParams.get('schools').split(',') : [],
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });

  const { data, isLoading } = useTransactions(page, 10, {
    search,
    sort: sortField,
    order: sortOrder,
    ...filters
  });

  const { data: schoolsData } = useSchools();

  // Update URL with current filters and pagination
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (search) params.set('search', search);
    if (sortField !== 'createdAt') params.set('sort', sortField);
    if (sortOrder !== 'desc') params.set('order', sortOrder);
    if (filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.schools.length > 0) params.set('schools', filters.schools.join(','));
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    
    setSearchParams(params);
  }, [page, search, sortField, sortOrder, filters, setSearchParams]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const pagination = data?.data?.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h2>
        <div className="w-64">
          <SearchBar 
            value={search} 
            onChange={handleSearch} 
            placeholder="Search transactions..." 
          />
        </div>
      </div>

      <Filters 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
        schools={schoolsData?.data || []} 
      />

      <TransactionTable 
        transactions={data?.data?.transactions || []} 
        loading={isLoading}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * 10, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
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
              disabled={page === pagination.pages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
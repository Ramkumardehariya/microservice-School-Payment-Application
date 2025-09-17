// src/components/Transactions/Filters.jsx
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

const statusOptions = [
  { value: 'success', label: 'Success', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

const Filters = ({ filters, onFiltersChange, schools }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleSchoolChange = (schoolId) => {
    const newSchools = filters.schools.includes(schoolId)
      ? filters.schools.filter(id => id !== schoolId)
      : [...filters.schools, schoolId];
    
    onFiltersChange({ ...filters, schools: newSchools });
  };

  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ status: [], schools: [], startDate: '', endDate: '' });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.schools.length > 0 || filters.startDate || filters.endDate;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Active
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear all
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(option.value)}
                      onChange={() => handleStatusChange(option.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* School filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schools
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {schools?.map(school => (
                  <label key={school._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.schools.includes(school._id)}
                      onChange={() => handleSchoolChange(school._id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {school.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
// src/components/Payment/PaymentForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchools } from '../../hooks/useSchools';
import api from '../../utils/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    schoolId: '',
    student: {
      name: '',
      id: '',
      email: ''
    },
    gatewayName: 'razorpay',
    orderAmount: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const { user } = useAuth();
  const { schools, isLoading: schoolsLoading } = useSchools();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('student.')) {
      const studentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          [studentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // School validation
    if (!formData.schoolId) {
      newErrors.schoolId = 'School is required';
    }

    // Student name validation
    if (!formData.student.name.trim()) {
      newErrors['student.name'] = 'Student name is required';
    }

    // Student ID validation
    if (!formData.student.id.trim()) {
      newErrors['student.id'] = 'Student ID is required';
    }

    // Student email validation
    if (!formData.student.email.trim()) {
      newErrors['student.email'] = 'Student email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.student.email)) {
      newErrors['student.email'] = 'Please enter a valid email address';
    }

    // Order amount validation
    if (!formData.orderAmount) {
      newErrors.orderAmount = 'Order amount is required';
    } else if (isNaN(formData.orderAmount) || parseFloat(formData.orderAmount) <= 0) {
      newErrors.orderAmount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setPaymentUrl('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        ...formData,
        orderAmount: parseFloat(formData.orderAmount),
        trusteeId: user.id // Add the current user's ID as trusteeId
      };

      const response = await api.post('/payment/createPayment', paymentData);
      
      if (response.data.success) {
        setSuccessMessage('Payment created successfully!');
        setPaymentUrl(response.data.data.paymentUrl);
        
        // Reset form
        setFormData({
          schoolId: '',
          student: {
            name: '',
            id: '',
            email: ''
          },
          gatewayName: 'razorpay',
          orderAmount: ''
        });
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to create payment. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has permission to create payments
  if (!user || (user.role !== 'trustee' && user.role !== 'admin')) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Access Denied</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You need to be a Trustee or Administrator to create payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Payment</h2>
      
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 mb-6 dark:bg-green-900/20">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
              {paymentUrl && (
                <div className="mt-2">
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/40"
                  >
                    Proceed to Payment
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4 mb-6 dark:bg-red-900/20">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            School *
          </label>
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className={`input-field ${errors.schoolId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            disabled={schoolsLoading}
          >
            <option value="">Select a school</option>
            {schools.map(school => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.schoolId}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="student.name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Student Name *
            </label>
            <input
              id="student.name"
              name="student.name"
              type="text"
              value={formData.student.name}
              onChange={handleChange}
              className={`input-field ${errors['student.name'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter student name"
            />
            {errors['student.name'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['student.name']}</p>
            )}
          </div>

          <div>
            <label htmlFor="student.id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Student ID *
            </label>
            <input
              id="student.id"
              name="student.id"
              type="text"
              value={formData.student.id}
              onChange={handleChange}
              className={`input-field ${errors['student.id'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter student ID"
            />
            {errors['student.id'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['student.id']}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="student.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student Email *
          </label>
          <input
            id="student.email"
            name="student.email"
            type="email"
            value={formData.student.email}
            onChange={handleChange}
            className={`input-field ${errors['student.email'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="Enter student email"
          />
          {errors['student.email'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['student.email']}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gatewayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Gateway
            </label>
            <select
              id="gatewayName"
              name="gatewayName"
              value={formData.gatewayName}
              onChange={handleChange}
              className="input-field"
            >
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div>
            <label htmlFor="orderAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (₹) *
            </label>
            <input
              id="orderAmount"
              name="orderAmount"
              type="number"
              step="0.01"
              min="1"
              value={formData.orderAmount}
              onChange={handleChange}
              className={`input-field ${errors.orderAmount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter amount"
            />
            {errors.orderAmount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.orderAmount}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || schoolsLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Creating Payment...</span>
              </>
            ) : (
              'Create Payment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
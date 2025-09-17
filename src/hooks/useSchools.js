// src/hooks/useSchools.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Replace the schools fetching logic in Signup.jsx with:
// const { schools, isLoading: isLoadingSchools, error: schoolsError } = useSchools();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get('/school/getAllSchool');
        
        if (response.data.success) {
          setSchools(response.data.data || []);
        } else {
          setError('Failed to load schools');
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Error loading schools. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return { schools, isLoading, error };
};
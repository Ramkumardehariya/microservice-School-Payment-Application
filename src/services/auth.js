import api from './api';

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    // Clear local storage
    localStorage.removeItem('user');
    // The HTTP-only cookie will be handled by the server
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check if the server is running.');
    } else {
      // Something else happened
      throw new Error('An error occurred during registration.');
    }
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check if the server is running.');
    } else {
      // Something else happened
      throw new Error('An error occurred during login.');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};


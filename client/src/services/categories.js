import api from './api';

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data.categories;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};





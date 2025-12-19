import api from './api';

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  const url = `/products?${params.toString()}`;
  console.log('🔍 Fetching products from:', url);
  const response = await api.get(url);
  console.log('📡 API Response:', response.data);
  const products = response.data.products || response.data || [];
  console.log('✅ Products returned:', products.length);
  return products;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.product;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getMyProducts = async () => {
  const response = await api.get('/products/user/my-products');
  return response.data.products;
};


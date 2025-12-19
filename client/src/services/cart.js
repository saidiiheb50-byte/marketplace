import api from './api';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data.cart;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { product_id: productId, quantity });
  return response.data;
};

export const updateCartItem = async (cartId, quantity) => {
  const response = await api.put(`/cart/${cartId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (cartId) => {
  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};





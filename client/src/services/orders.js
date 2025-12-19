import api from './api';

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data.orders;
};

export const getSales = async () => {
  const response = await api.get('/orders/sales');
  return response.data.sales;
};

export const getSaleDetail = async (orderId) => {
  const response = await api.get(`/orders/sales/${orderId}`);
  return response.data.order;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.order;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};


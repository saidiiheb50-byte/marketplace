import api from './api';

export const processSellerPayment = async (amount, paymentData, token) => {
  const response = await api.post(
    '/payments/seller',
    {
      amount,
      paymentMethod: paymentData.paymentMethod || 'manual',
      paymentNote: paymentData.paymentNote || ''
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const checkSellerPaymentStatus = async () => {
  const response = await api.get('/payments/seller/status');
  return response.data;
};


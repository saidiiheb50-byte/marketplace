import api from './api';

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data.conversations;
};

export const getMessages = async (userId) => {
  const response = await api.get(`/messages/user/${userId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/messages/unread/count');
  return response.data.count;
};




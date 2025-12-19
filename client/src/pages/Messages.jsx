import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react';
import { getConversations, getMessages, sendMessage } from '../services/messages';
import { getCurrentUser } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import Skeleton from '../components/Skeleton';

const Messages = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');
  const user = getCurrentUser();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      
      // If userId is in URL, select that conversation
      if (userId) {
        const conv = data.find(c => c.other_user_id === parseInt(userId));
        if (conv) {
          setSelectedConversation(conv);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const data = await getMessages(otherUserId);
      setMessages(data.messages);
      setSelectedConversation({
        other_user_id: otherUserId,
        other_user_name: data.otherUser.name
      });
      fetchConversations(); // Refresh to update unread status
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        receiver_id: selectedConversation.other_user_id,
        product_id: productId || null,
        message: messageText
      });
      setMessageText('');
      fetchMessages(selectedConversation.other_user_id);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending message');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="title" className="w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          <div className="lg:col-span-1 card p-4 space-y-4">
            <Skeleton variant="heading" className="w-32" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
          </div>
          <div className="lg:col-span-2 card p-4 space-y-4">
            <Skeleton variant="heading" className="w-48" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 card overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.other_user_id}
                    onClick={() => {
                      navigate(`/messages/user/${conv.other_user_id}`);
                      fetchMessages(conv.other_user_id);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation?.other_user_id === conv.other_user_id
                        ? 'bg-primary-50 border-l-4 border-primary-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{conv.other_user_name}</p>
                        {conv.product_title && (
                          <p className="text-sm text-gray-500 truncate">Re: {conv.product_title}</p>
                        )}
                        <p className="text-xs text-gray-400 truncate">{conv.last_message}</p>
                      </div>
                      {!conv.read_status && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center space-x-3">
                <Link to="/messages" className="lg:hidden">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold">{selectedConversation.other_user_name}</p>
                  {selectedConversation.product_title && (
                    <p className="text-sm text-gray-500">Re: {selectedConversation.product_title}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender_id === user.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {msg.product_title && (
                          <Link
                            to={`/products/${msg.product_id}`}
                            className="text-xs underline mb-1 block"
                          >
                            Re: {msg.product_title}
                          </Link>
                        )}
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user.id ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary">
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="mx-auto h-16 w-16 mb-4 text-gray-400" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;


import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { getOrder, getSaleDetail, updateOrderStatus } from '../services/orders';
import { getCurrentUser } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import Skeleton from '../components/Skeleton';
import { parseProductImages } from '../utils/imageParser';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const user = getCurrentUser();
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      // Try to get as buyer first
      try {
        const data = await getOrder(id);
        setOrder(data);
        setIsSeller(false);
      } catch (buyerError) {
        // If not found as buyer, try as seller
        if (buyerError.response?.status === 404) {
          try {
            const saleData = await getSaleDetail(id);
            setOrder(saleData);
            setIsSeller(true);
          } catch (sellerError) {
            console.error('Error fetching order:', sellerError);
            navigate('/orders');
          }
        } else {
          throw buyerError;
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success('Order status updated successfully');
      fetchOrder(); // Refresh order data
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="text" className="w-32 mb-6" />
        <div className="card p-6 mb-6 space-y-4">
          <Skeleton variant="title" className="w-48" />
          <Skeleton variant="text" className="w-64" />
        </div>
        <div className="card p-6 space-y-4">
          <Skeleton variant="heading" className="w-32" />
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-3/4" />
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Order not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-600 hover:text-primary-700">
          ← Back to Orders
        </Link>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isSeller ? 'Sale' : 'Order'} #{order.id}
            </h1>
            <p className="text-gray-500">
              {isSeller ? 'Sold' : 'Placed'} on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500 mt-2">Payment: {order.payment_status}</p>
          </div>
        </div>

        {/* Buyer Info (for sellers) */}
        {isSeller && order.buyer_name && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Buyer Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.buyer_name}</p>
              </div>
              {order.buyer_email && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </p>
                  <a href={`mailto:${order.buyer_email}`} className="font-semibold text-primary-600 hover:underline">
                    {order.buyer_email}
                  </a>
                </div>
              )}
              {order.buyer_phone && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </p>
                  <a href={`tel:${order.buyer_phone}`} className="font-semibold text-primary-600 hover:underline">
                    {order.buyer_phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Update (for sellers) */}
        {isSeller && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <h3 className="font-semibold mb-3">Update Order Status</h3>
            <div className="flex flex-wrap gap-2">
              {['processing', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={order.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    order.status === status
                      ? 'bg-primary-600 text-white cursor-not-allowed'
                      : 'bg-white text-primary-600 hover:bg-primary-100 border-2 border-primary-300'
                  }`}
                >
                  Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-semibold">Payment Method</h3>
            </div>
            <p className="text-gray-700 capitalize">{order.payment_method.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {(() => {
                    const images = parseProductImages(item.images);
                    return images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-12 w-12" />
                      </div>
                    );
                  })()}
                </div>
              </Link>
              <div className="flex-grow">
                <Link to={`/products/${item.product_id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary-600">{item.title}</h3>
                </Link>
                {!isSeller && item.seller_name && (
                  <p className="text-sm text-gray-500">Sold by: {item.seller_name}</p>
                )}
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary-600">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-500">{item.price} TND each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-xl">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary-600 text-2xl">{order.total_amount} TND</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;


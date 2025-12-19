import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart } from '../services/cart';
import { getCurrentUser } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const toast = useToast();

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartId);
      return;
    }
    try {
      await updateCartItem(cartId, newQuantity);
      fetchCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Error updating cart');
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeFromCart(cartId);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="title" className="w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-4">
                <Skeleton variant="image" className="w-32 h-32" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="heading" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                  <Skeleton variant="text" className="w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Add some products to get started!"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div 
              key={item.id} 
              className="card p-6 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/products/${item.product_id}`} className="flex-shrink-0 group">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-primary-300 transition-all">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                      <ShoppingCart className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">Sold by: <span className="font-medium">{item.seller_name}</span></p>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <p className="text-2xl font-bold text-primary-600">
                      {item.price} TND
                    </p>
                    <p className="text-sm text-gray-500">each</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock_quantity}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} TND
                    </p>
                    {item.quantity >= item.stock_quantity && (
                      <p className="text-xs text-red-600 mt-1">Max stock reached</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 bg-gradient-to-br from-white to-gray-50 border-2 border-primary-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-primary-600" />
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-900">{calculateTotal().toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">{calculateTotal().toFixed(2)} TND</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-primary w-full text-center flex items-center justify-center group shadow-lg hover:shadow-xl transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-center text-gray-500 mt-4">
              🔒 Secure checkout • Free shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


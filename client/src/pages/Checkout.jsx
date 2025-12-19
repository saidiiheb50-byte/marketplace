import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { getCart, clearCart } from '../services/cart';
import { createOrder } from '../services/orders';
import { getCurrentUser } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import Skeleton from '../components/Skeleton';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shipping_address: '',
    payment_method: 'cash_on_delivery'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = getCurrentUser();

  const steps = [
    { number: 1, name: 'Cart', icon: '🛒' },
    { number: 2, name: 'Shipping', icon: '📍' },
    { number: 3, name: 'Payment', icon: '💳' },
    { number: 4, name: 'Review', icon: '✓' },
  ];

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
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const toast = useToast();

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 2 && !formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    }
    if (step === 3 && !formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);

    try {
      const order = await createOrder(formData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.order.id}`, { state: { success: true } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error creating order');
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="title" className="w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <Skeleton variant="heading" className="w-48" />
              <Skeleton variant="text" className="w-full" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6 space-y-4">
              <Skeleton variant="heading" className="w-32" />
              <Skeleton variant="text" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  currentStep >= step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 2: Shipping Address */}
          {currentStep >= 2 && (
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <textarea
                required
                rows="4"
                className={`input-field w-full ${errors.shipping_address ? 'border-red-500' : ''}`}
                placeholder="Enter your full shipping address..."
                value={formData.shipping_address}
                onChange={(e) => {
                  setFormData({ ...formData, shipping_address: e.target.value });
                  if (errors.shipping_address) setErrors({ ...errors, shipping_address: '' });
                }}
              />
              {errors.shipping_address && (
                <p className="mt-1 text-sm text-red-600">{errors.shipping_address}</p>
              )}
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep >= 3 && (
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.payment_method === 'cash_on_delivery'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash_on_delivery"
                    checked={formData.payment_method === 'cash_on_delivery'}
                    onChange={(e) => {
                      setFormData({ ...formData, payment_method: e.target.value });
                      if (errors.payment_method) setErrors({ ...errors, payment_method: '' });
                    }}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive the order</div>
                  </div>
                </label>
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.payment_method === 'bank_transfer'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank_transfer"
                    checked={formData.payment_method === 'bank_transfer'}
                    onChange={(e) => {
                      setFormData({ ...formData, payment_method: e.target.value });
                      if (errors.payment_method) setErrors({ ...errors, payment_method: '' });
                    }}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-gray-500">Transfer funds to seller's account</div>
                  </div>
                </label>
              </div>
              {errors.payment_method && (
                <p className="mt-2 text-sm text-red-600">{errors.payment_method}</p>
              )}
            </div>
          )}

          {/* Step 4: Review Order */}
          {currentStep >= 4 && (
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Review Your Order</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-gray-700">{formData.shipping_address}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p className="text-gray-700 capitalize">{formData.payment_method.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold">{(parseFloat(item.price) * item.quantity).toFixed(2)} TND</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                  {!submitting && <CheckCircle className="ml-2 h-4 w-4 inline" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span className="font-semibold">{calculateTotal().toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">{calculateTotal().toFixed(2)} TND</span>
              </div>
            </div>
            {currentStep === 4 && (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {submitting ? 'Processing...' : 'Place Order'}
                {!submitting && <CheckCircle className="ml-2 h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;


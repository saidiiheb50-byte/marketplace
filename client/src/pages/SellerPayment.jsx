import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { register } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import FormInput from '../components/FormInput';
import { processSellerPayment } from '../services/payments';

const SellerPayment = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1); // 1: Register, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentAmount] = useState(50.00); // Seller fee in TND
  const [paymentNote, setPaymentNote] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        ...formData,
        user_type: 'seller'
      });
      
      // Store token temporarily
      localStorage.setItem('tempToken', response.token);
      localStorage.setItem('tempUser', JSON.stringify(response.user));
      
      setStep(2);
      toast.success('Account created! Please complete payment.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      setErrors({ general: error.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrors({});

    setLoading(true);
    try {
      const tempToken = localStorage.getItem('tempToken');
      // Submit payment request (pending status)
      await processSellerPayment(paymentAmount, { paymentNote, paymentMethod: 'manual' }, tempToken);
      
      // Move to success step
      setStep(3);
      
      // Set actual token and user
      const tempUser = JSON.parse(localStorage.getItem('tempUser') || '{}');
      localStorage.setItem('token', tempToken);
      localStorage.setItem('user', JSON.stringify(tempUser));
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempUser');
      
      toast.success('Payment request submitted! Your account will be activated after manual payment verification.');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Reload to update user state
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit payment request');
      setErrors({ general: error.response?.data?.error || 'Failed to submit payment request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <CheckCircle className="h-6 w-6" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Register</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <CheckCircle className="h-6 w-6" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        <div className="card p-8">
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Seller Account</h1>
                <p className="text-gray-600">Register to start selling on Béja Marketplace</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  required
                />
                <FormInput
                  label="Phone (Optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  required
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  required
                />

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.general}
                  </div>
                )}

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-semibold text-primary-900">Seller Fee: {paymentAmount} TND</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    A one-time payment is required to activate your seller account. This gives you unlimited access to list products and manage your sales.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Creating Account...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Payment Information</h1>
                <p className="text-gray-600">Submit your payment request for manual verification</p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary-600">{paymentAmount} TND</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Manual Payment Process</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Payment will be completed manually when we meet in person. After you submit this request:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          <li>Your account will be created with pending payment status</li>
                          <li>You'll receive instructions on how to complete the payment</li>
                          <li>Once payment is received, your account will be activated</li>
                          <li>You'll be able to create listings and access your dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 mb-1">Important Notice</p>
                      <p className="text-sm text-yellow-800">
                        Your seller account will remain inactive until payment is verified. You'll receive an email with payment instructions and contact details.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Any additional information you'd like to include..."
                    className="input-field min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.general}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {loading ? 'Submitting...' : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Submit Payment Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Payment Request Submitted!</h2>
                <p className="text-gray-600 mb-4">Your seller account has been created with pending payment status.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
                  <p className="text-sm text-blue-900 font-semibold mb-2">What happens next?</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>You'll receive an email with payment instructions</li>
                    <li>Complete the payment when we meet in person</li>
                    <li>Your account will be activated after payment verification</li>
                    <li>You'll be notified once your account is active</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPayment;


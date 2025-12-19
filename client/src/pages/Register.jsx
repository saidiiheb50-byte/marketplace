import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { UserPlus } from 'lucide-react';
import FormInput from '../components/FormInput';
import { useToast } from '../contexts/ToastContext';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Get user type from localStorage (set by WelcomeModal)
    const userType = localStorage.getItem('userType') || 'buyer';

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      registerData.user_type = userType; // Add user type from localStorage
      const response = await register(registerData);
      setUser(response.user);
      
      if (userType === 'buyer') {
        toast.success('Account created! Your account is pending admin approval.');
        // Show pending message
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error details:', err);
      let errorMsg = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMsg = err.response.data?.error || err.response.data?.errors?.[0]?.msg || errorMsg;
        if (err.response.data?.errors) {
          const fieldErrors = {};
          err.response.data.errors.forEach(err => {
            fieldErrors[err.param] = err.msg;
          });
          setErrors(fieldErrors);
        }
      } else if (err.message) {
        // Network or other error
        errorMsg = err.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-md w-full space-y-8">
        <div className="card p-8">
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create Buyer Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Free account to browse and purchase items
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="John Doe"
                required
              />
              <FormInput
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                placeholder="you@example.com"
                required
              />
              <FormInput
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                placeholder="+216 XX XXX XXX"
              />
              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                placeholder="••••••••"
                required
              />
              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;


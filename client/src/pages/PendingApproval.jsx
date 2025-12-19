import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../services/auth';
import { useToast } from '../contexts/ToastContext';

const PendingApproval = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = getCurrentUser();

  useEffect(() => {
    // Check if account is still pending
    if (user && user.account_status === 'active') {
      navigate('/');
    } else if (user && (user.account_status === 'rejected' || user.account_status === 'suspended')) {
      // Account rejected or suspended
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
            <p className="text-gray-600">
              Your account is waiting for admin approval
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-yellow-900 mb-2">What happens next?</p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Your account has been created successfully</li>
                  <li>An admin will review your account</li>
                  <li>You'll be notified once your account is activated</li>
                  <li>Once approved, you can browse and purchase items</li>
                </ul>
              </div>
            </div>
          </div>

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Account Information</p>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary flex-1"
            >
              Check Status
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center justify-center space-x-2 flex-1"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;





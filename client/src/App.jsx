import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastProvider } from './contexts/ToastContext';

// Initialize i18n
import './i18n/config';
import Navbar from './components/Navbar';
import FavoritesBar from './components/FavoritesBar';
import WelcomeModal from './components/WelcomeModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerPayment from './pages/SellerPayment';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Messages from './pages/Messages';
import PendingApproval from './pages/PendingApproval';
import { getCurrentUser, isAuthenticated } from './services/auth';

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Show welcome modal if user is not logged in
    // This will show every time until they log in
    if (!currentUser) {
      console.log('No user found, showing welcome modal');
      // Small delay to ensure smooth rendering
      setTimeout(() => {
        setShowWelcomeModal(true);
        console.log('Welcome modal should be visible now');
      }, 100);
    } else {
      console.log('User is logged in, not showing modal');
    }
  }, []);

  const handleUserTypeSelect = (type) => {
    localStorage.setItem('userType', type);
    setShowWelcomeModal(false);
    // If buyer chose to browse, just close the modal
    // If buyer chose to register, they'll be redirected by WelcomeModal
    // If seller, they'll be redirected to payment page
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    // Check if account is pending approval
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.account_status === 'pending') {
      return <PendingApproval />;
    }
    
    if (currentUser && (currentUser.account_status === 'rejected' || currentUser.account_status === 'suspended')) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Account {currentUser.account_status === 'rejected' ? 'Rejected' : 'Suspended'}</h1>
            <p className="text-gray-600">Please contact support for assistance.</p>
          </div>
        </div>
      );
    }
    
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">{t('common.loading')}</div>;
    }
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    if (user?.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return children;
  };

      return (
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              {showWelcomeModal && (
                <WelcomeModal onSelect={handleUserTypeSelect} />
              )}
              <Navbar user={user} setUser={setUser} />
              <FavoritesBar />
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/" /> : <Login setUser={setUser} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated() ? <Navigate to="/" /> : <Register setUser={setUser} />} 
          />
          <Route 
            path="/seller-payment" 
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <SellerPayment />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-product" 
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-product/:id" 
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages/user/:userId" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;


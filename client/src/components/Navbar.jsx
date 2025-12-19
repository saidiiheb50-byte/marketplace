import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User, LogOut, Plus, LayoutDashboard, Shield, ShoppingCart, Heart, MessageCircle, Menu } from 'lucide-react';
import { logout } from '../services/auth';
import { getCart } from '../services/cart';
import { getUnreadCount } from '../services/messages';
import { isAuthenticated } from '../services/auth';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ user, setUser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartCount();
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const cart = await getCart();
      setCartCount(cart.length);
    } catch (error) {
      // Ignore errors
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Ignore errors
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Béja Marketplace</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('nav.browse')}
            </Link>
            {user ? (
              <>
                {(user.user_type === 'seller' && user.seller_payment_status === 'paid') && (
                  <Link
                    to="/create-product"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('nav.sell')}</span>
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                  <span className="hidden lg:inline">{t('nav.cart')}</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="hidden lg:inline">{t('nav.wishlist')}</span>
                </Link>
                <Link
                  to="/messages"
                  className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <span className="hidden lg:inline">{t('nav.messages')}</span>
                </Link>
                {(user.user_type === 'seller' && user.seller_payment_status === 'paid') && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <span>{t('nav.orders')}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{t('nav.admin')}</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('nav.signUp')}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 p-2 hover:bg-gray-100 rounded"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        unreadCount={unreadCount}
      /> */}
    </nav>
  );
};

export default Navbar;


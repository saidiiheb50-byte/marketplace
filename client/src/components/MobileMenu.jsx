import { Link } from 'react-router-dom';
import { X, ShoppingBag, User, LogOut, Plus, LayoutDashboard, Shield, ShoppingCart, Heart, MessageCircle } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, user, onLogout, cartCount, unreadCount }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <ShoppingBag className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold">Béja Marketplace</span>
            </Link>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Browse</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-product"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Sell</span>
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/messages"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 transition-colors text-primary-600 font-medium"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="border-t my-2 pt-2">
                  <div className="flex items-center space-x-3 p-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex items-center justify-center space-x-3 p-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;


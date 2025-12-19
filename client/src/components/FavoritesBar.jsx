import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ChevronRight, ShoppingCart } from 'lucide-react';
import { getWishlist } from '../services/wishlist';
import { getCurrentUser, isAuthenticated } from '../services/auth';
import { addToCart } from '../services/cart';
import { useToast } from '../contexts/ToastContext';
import { parseProductImages } from '../utils/imageParser';

const FavoritesBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchFavorites();
    }
  }, [isOpen]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setFavorites(data.slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  if (!isAuthenticated() || favorites.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-l-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Toggle favorites"
      >
        <div className="relative">
          <Heart className="h-6 w-6 fill-current" />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length > 9 ? '9+' : favorites.length}
            </span>
          )}
        </div>
      </button>

      {/* Favorites Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 fill-current" />
                <h2 className="text-xl font-bold">My Favorites</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close favorites"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Link
              to="/wishlist"
              className="text-sm hover:underline flex items-center space-x-1"
            >
              <span>View all favorites</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No favorites yet</p>
              </div>
            ) : (
              favorites.map((item) => {
                const images = parseProductImages(item.images);
                return (
                  <div
                    key={item.id}
                    className="group border-2 border-gray-100 rounded-xl p-3 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-3">
                      <Link
                        to={`/products/${item.id}`}
                        className="flex-shrink-0"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {images.length > 0 ? (
                            <img
                              src={images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Heart className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-primary-600 mb-2">
                          {item.price} TND
                        </p>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="w-full flex items-center justify-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FavoritesBar;


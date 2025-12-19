import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { isAuthenticated } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../services/cart';
import { addToWishlist, removeFromWishlist } from '../services/wishlist';
import { useToast } from '../contexts/ToastContext';
import ProductBadge from './ProductBadge';
import { parseProductImages } from '../utils/imageParser';

const ProductCard = ({ product, onWishlistChange }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const images = parseProductImages(product.images);
  const isNew = product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
      if (onWishlistChange) onWishlistChange();
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="card overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        {isNew && <ProductBadge type="new" />}
        {isOutOfStock && <ProductBadge type="out_of_stock" />}
      </div>

      {/* Quick Actions on Hover */}
      {isAuthenticated() && isHovered && !isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 animate-fade-in">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              inWishlist
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="p-2 rounded-full bg-white text-gray-700 hover:bg-primary-600 hover:text-white shadow-lg transition-colors"
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-gray-200 overflow-hidden relative">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="h-16 w-16" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-primary-600 font-bold text-lg mb-1">{product.price} TND</p>
        <p className="text-sm text-gray-500 mb-2">{product.location}</p>
        {product.category_name && (
          <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
            {product.category_name}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;


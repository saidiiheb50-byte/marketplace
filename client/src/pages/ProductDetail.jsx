import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Phone, Mail, Edit, Trash2, ShoppingCart, Heart, MessageCircle, Star, Plus, Minus } from 'lucide-react';
import { getProduct, deleteProduct } from '../services/products';
import { getCurrentUser, isAuthenticated } from '../services/auth';
import { addToCart } from '../services/cart';
import { addToWishlist, removeFromWishlist, checkWishlist } from '../services/wishlist';
import { getProductReviews, getProductReviewSummary, createReview } from '../services/reviews';
import { sendMessage } from '../services/messages';
import { useToast } from '../contexts/ToastContext';
import ImageGallery from '../components/ImageGallery';
import Skeleton from '../components/Skeleton';
import { parseProductImages } from '../utils/imageParser';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [messageText, setMessageText] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(0); // 0 = all, 1-5 = filter by rating
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
        setUser(getCurrentUser());
        
        // Fetch reviews
        const [reviewsData, summaryData] = await Promise.all([
          getProductReviews(id).catch(() => []),
          getProductReviewSummary(id).catch(() => null)
        ]);
        setReviews(reviewsData);
        setReviewSummary(summaryData);
        
        // Check wishlist if user is logged in
        if (isAuthenticated()) {
          const inWishlist = await checkWishlist(id).catch(() => false);
          setInWishlist(inWishlist);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(id, quantity);
      toast.success('Added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!messageText.trim()) {
      toast.warning('Please enter a message');
      return;
    }
    try {
      await sendMessage({
        receiver_id: product.user_id,
        product_id: id,
        message: messageText
      });
      setMessageText('');
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending message');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      await createReview({
        product_id: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
      // Refresh reviews
      const [reviewsData, summaryData] = await Promise.all([
        getProductReviews(id),
        getProductReviewSummary(id)
      ]);
      setReviews(reviewsData);
      setReviewSummary(summaryData);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error submitting review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Skeleton variant="image" className="w-full aspect-square" />
          </div>
          <div className="space-y-4">
            <Skeleton variant="title" className="w-3/4" />
            <Skeleton variant="heading" className="w-1/2" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Product not found</div>;
  }

  const images = parseProductImages(product.images);
  const isOwner = user && user.id === product.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <ImageGallery images={images} title={product.title} />
        </div>

        {/* Details */}
        <div>
          <div className="card p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-4">{product.price} TND</p>
            
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <MapPin className="h-5 w-5" />
              <span>{product.location}</span>
            </div>

            {product.category_name && (
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm mb-4">
                {product.category_name}
              </span>
            )}

            <div className="border-t pt-4 mt-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {product.condition && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Condition: </span>
                <span className="font-semibold capitalize">{product.condition.replace('_', ' ')}</span>
              </div>
            )}

            {product.stock_quantity !== undefined && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Stock: </span>
                <span className="font-semibold">{product.stock_quantity} available</span>
              </div>
            )}

            {/* Reviews Summary */}
            {reviewSummary && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{parseFloat(reviewSummary.average_rating || 0).toFixed(1)}</div>
                    <div className="flex items-center justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(reviewSummary.average_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{reviewSummary.total_reviews} reviews</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && isAuthenticated() && (
              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded border hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 1, quantity + 1))}
                    className="p-2 rounded border hover:bg-gray-100"
                    disabled={quantity >= (product.stock_quantity || 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || (product.stock_quantity || 0) === 0}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 transition-colors ${
                      inWishlist
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <Link
                    to={`/messages/user/${product.user_id}?product=${id}`}
                    className="flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Message Seller
                  </Link>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="flex space-x-4 mt-6 pt-4 border-t">
                <Link
                  to={`/edit-product/${id}`}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-semibold">{product.seller_name}</span>
              </div>
              {product.seller_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <a href={`tel:${product.seller_phone}`} className="text-primary-600 hover:underline">
                    {product.seller_phone}
                  </a>
                </div>
              )}
              {product.seller_email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <a href={`mailto:${product.seller_email}`} className="text-primary-600 hover:underline">
                    {product.seller_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-center space-x-4">
              {/* Review Filter */}
              {reviews.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Filter:</span>
                  <button
                    onClick={() => setReviewFilter(0)}
                    className={`px-3 py-1 rounded text-sm ${
                      reviewFilter === 0
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewFilter(rating)}
                      className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                        reviewFilter === rating
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      <span>{rating}</span>
                    </button>
                  ))}
                </div>
              )}
              {isAuthenticated() && !isOwner && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-secondary"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 border rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  rows="4"
                  className="input-field w-full"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (() => {
            const filteredReviews = reviewFilter === 0
              ? reviews
              : reviews.filter(r => r.rating === reviewFilter);
            
            return filteredReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No {reviewFilter > 0 ? `${reviewFilter}-star ` : ''}reviews found
              </p>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0 animate-fade-in">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user_name}</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


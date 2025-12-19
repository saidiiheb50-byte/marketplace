import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { getMyProducts, deleteProduct } from '../services/products';
import { getCurrentUser } from '../services/auth';
import { getSales } from '../services/orders';
import { useToast } from '../contexts/ToastContext';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { parseProductImages } from '../utils/imageParser';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  const toast = useToast();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/create-product" className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>List New Item</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Products</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0).toFixed(2)} TND
              </p>
            </div>
            <ShoppingBag className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* My Sales Section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
            My Sales
          </h2>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium">
            View All Orders →
          </Link>
        </div>
        {salesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton variant="avatar" />
                  <div className="space-y-2">
                    <Skeleton variant="heading" className="w-48" />
                    <Skeleton variant="text" className="w-32" />
                  </div>
                </div>
                <Skeleton variant="heading" className="w-24" />
              </div>
            ))}
          </div>
        ) : sales.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No sales yet"
            message="Your products haven't been purchased yet. Keep listing!"
            actionLabel="List New Product"
            actionLink="/create-product"
          />
        ) : (
          <div className="space-y-4">
            {sales.slice(0, 5).map((sale) => (
              <Link
                key={sale.order_id}
                to={`/orders/${sale.order_id}`}
                className="block p-4 border-2 border-gray-100 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">Order #{sale.order_id}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sale.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        sale.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        sale.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sale.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <Users className="h-4 w-4 inline mr-1" />
                      Buyer: <span className="font-medium">{sale.buyer_name}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Products: <span className="font-medium">{sale.products}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-primary-600">{parseFloat(sale.total_amount).toFixed(2)} TND</p>
                    <p className="text-xs text-gray-500">{sale.item_count} item(s)</p>
                  </div>
                </div>
              </Link>
            ))}
            {sales.length > 5 && (
              <Link
                to="/orders"
                className="block text-center text-primary-600 hover:text-primary-700 font-medium py-2"
              >
                View all {sales.length} sales →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* My Products Section */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton variant="image" className="w-full aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="heading" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="You haven't listed any products yet"
            message="Start selling your items today!"
            actionLabel="Create Your First Listing"
            onAction={() => window.location.href = '/create-product'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const images = parseProductImages(product.images);
              return (
                <div key={product.id} className="card overflow-hidden">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                    <p className="text-primary-600 font-bold">{product.price} TND</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-product/${product.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


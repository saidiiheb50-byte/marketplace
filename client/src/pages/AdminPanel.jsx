import { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Users, Package, BarChart3, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import Skeleton from '../components/Skeleton';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingBuyers, setPendingBuyers] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await api.get('/admin/seller-payments');
      setPendingPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const fetchPendingBuyers = async () => {
    try {
      const response = await api.get('/admin/pending-buyers');
      setPendingBuyers(response.data.users);
    } catch (error) {
      console.error('Error fetching pending buyers:', error);
    }
  };

  const toast = useToast();

  const handleStatusChange = async (productId, status) => {
    try {
      await api.put(`/admin/products/${productId}/status`, { status });
      fetchProducts();
      toast.success('Product status updated');
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/admin/products/${productId}`);
      fetchProducts();
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      await api.put(`/admin/seller-payments/${paymentId}/approve`);
      fetchPendingPayments();
      toast.success('Seller account activated successfully!');
    } catch (error) {
      toast.error('Error activating account');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to reject this payment request?')) {
      return;
    }
    try {
      await api.put(`/admin/seller-payments/${paymentId}/reject`);
      fetchPendingPayments();
      toast.success('Payment request rejected');
    } catch (error) {
      toast.error('Error rejecting payment');
    }
  };

  const handleApproveBuyer = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/approve`);
      fetchPendingBuyers();
      fetchUsers();
      toast.success('Buyer account approved successfully!');
    } catch (error) {
      toast.error('Error approving account');
    }
  };

  const handleRejectBuyer = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this buyer account?')) {
      return;
    }
    try {
      await api.put(`/admin/users/${userId}/reject`);
      fetchPendingBuyers();
      fetchUsers();
      toast.success('Buyer account rejected');
    } catch (error) {
      toast.error('Error rejecting account');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'payments') {
      fetchPendingPayments();
    } else if (activeTab === 'buyers') {
      fetchPendingBuyers();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-8 w-8 text-red-600" />
        <h1 className="text-4xl font-bold">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-4 px-4 font-semibold ${
            activeTab === 'stats' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 font-semibold ${
            activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-4 font-semibold ${
            activeTab === 'products' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-4 px-4 font-semibold relative ${
            activeTab === 'payments' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
          }`}
        >
          Seller Payments
          {pendingPayments.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingPayments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('buyers')}
          className={`pb-4 px-4 font-semibold relative ${
            activeTab === 'buyers' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
          }`}
        >
          Pending Buyers
          {pendingBuyers.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingBuyers.length}
            </span>
          )}
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : stats ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Active Products</p>
                    <p className="text-3xl font-bold">{stats.activeProducts}</p>
                  </div>
                  <Package className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Categories</p>
                    <p className="text-3xl font-bold">{stats.totalCategories}</p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-primary-600" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.id}</td>
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.phone || '-'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Buyers Tab */}
      {activeTab === 'buyers' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Pending Buyer Accounts</h2>
            <button
              onClick={fetchPendingBuyers}
              className="btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          {pendingBuyers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pending buyer accounts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBuyers.map((buyer) => (
                <div key={buyer.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{buyer.name}</h3>
                          <p className="text-sm text-gray-500">
                            Registered: {new Date(buyer.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Contact Information</p>
                          <p className="font-semibold">{buyer.email}</p>
                          {buyer.phone && (
                            <p className="text-sm text-gray-600">{buyer.phone}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Account Status</p>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Pending Approval
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <button
                      onClick={() => handleApproveBuyer(buyer.id)}
                      className="btn-primary flex items-center space-x-2 flex-1"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Approve Account</span>
                    </button>
                    <button
                      onClick={() => handleRejectBuyer(buyer.id)}
                      className="btn-secondary flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seller Payments Tab */}
      {activeTab === 'payments' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Pending Seller Payments</h2>
            <button
              onClick={fetchPendingPayments}
              className="btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          {pendingPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <CreditCard className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Payment Request #{payment.id}</h3>
                          <p className="text-sm text-gray-500">
                            Submitted: {new Date(payment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Seller Information</p>
                          <p className="font-semibold">{payment.user_name}</p>
                          <p className="text-sm text-gray-600">{payment.user_email}</p>
                          {payment.user_phone && (
                            <p className="text-sm text-gray-600">{payment.user_phone}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Payment Details</p>
                          <p className="text-2xl font-bold text-primary-600">{parseFloat(payment.amount).toFixed(2)} TND</p>
                          <p className="text-sm text-gray-600">Method: {payment.payment_method || 'Manual'}</p>
                        </div>
                      </div>

                      {payment.payment_note && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-800">{payment.payment_note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprovePayment(payment.id)}
                      className="btn-primary flex items-center space-x-2 flex-1"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Approve & Activate Account</span>
                    </button>
                    <button
                      onClick={() => handleRejectPayment(payment.id)}
                      className="btn-secondary flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">All Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Seller</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.id}</td>
                    <td className="py-2">{product.title}</td>
                    <td className="py-2">{product.price} TND</td>
                    <td className="py-2">{product.seller_name}</td>
                    <td className="py-2">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deleted">Deleted</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


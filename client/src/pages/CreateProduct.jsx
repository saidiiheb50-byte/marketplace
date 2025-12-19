import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/products';
import { getCategories } from '../services/categories';
import { Plus, X } from 'lucide-react';
import FormInput from '../components/FormInput';
import { useToast } from '../contexts/ToastContext';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'good',
    stock_quantity: 1,
    images: []
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setImageUrls([...imageUrls, url]);
      setFormData({ ...formData, images: [...imageUrls, url] });
    }
  };

  const handleImageRemove = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData({ ...formData, images: newUrls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title || !formData.description || !formData.price || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 1
      });
      toast.success('Product created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error creating product';
      toast.error(errorMsg);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(err => {
          fieldErrors[err.param] = err.msg;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-4xl font-bold mb-8">List a New Product</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6 page-transition">
        <FormInput
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          placeholder="e.g., iPhone 12 Pro Max"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`input-field ${errors.description ? 'border-red-500' : ''}`}
            rows="6"
            placeholder="Describe your item in detail..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Price (TND)"
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className={`input-field ${errors.category_id ? 'border-red-500' : ''}`}
              value={formData.category_id}
              onChange={(e) => {
                setFormData({ ...formData, category_id: e.target.value });
                if (errors.category_id) setErrors({ ...errors, category_id: '' });
              }}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
          </div>
        </div>

        <FormInput
          label="Stock Quantity"
          type="number"
          name="stock_quantity"
          value={formData.stock_quantity}
          onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 1 })}
          error={errors.stock_quantity}
          placeholder="1"
          min="1"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            className="input-field"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          >
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (URLs)
          </label>
          <div className="space-y-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <img src={url} alt={`Preview ${index + 1}`} className="h-16 w-16 object-cover rounded" />
                <input
                  type="text"
                  className="input-field flex-1"
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...imageUrls];
                    newUrls[index] = e.target.value;
                    setImageUrls(newUrls);
                    setFormData({ ...formData, images: newUrls });
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleImageAdd}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Image URL</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;


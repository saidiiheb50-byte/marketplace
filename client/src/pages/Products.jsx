import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown, Grid, List } from 'lucide-react';
import { getProducts } from '../services/products';
import { ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const prods = await getProducts(filters);
        console.log('📦 Products fetched:', prods);
        console.log('📊 Products count:', prods?.length || 0);
        setProducts(prods || []);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        console.error('Error details:', error.response?.data || error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    const clearedFilters = { search: '', category: '', minPrice: '', maxPrice: '', condition: '', sort: 'newest' };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  const handleSearch = (searchValue) => {
    handleFilterChange('search', searchValue);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Browse Products</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterSidebarOpen(true)}
            className="lg:hidden btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Sort Bar */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={filters.search}
                  onChange={(value) => handleFilterChange('search', value)}
                  onSearch={handleSearch}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden btn-secondary flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                </button>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="input-field pl-10 pr-8"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {products.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </div>
            )}
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              message="Try adjusting your filters or search terms"
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;


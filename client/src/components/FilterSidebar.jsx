import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import { getCategories } from '../services/categories';
import { useEffect } from 'react';

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice ? parseInt(filters.minPrice) : 0,
    max: filters.maxPrice ? parseInt(filters.maxPrice) : 10000
  });

  useEffect(() => {
    if (filters.minPrice || filters.maxPrice) {
      setPriceRange({
        min: filters.minPrice ? parseInt(filters.minPrice) : 0,
        max: filters.maxPrice ? parseInt(filters.maxPrice) : 10000
      });
    }
  }, [filters.minPrice, filters.maxPrice]);

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

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    onFilterChange('minPrice', range.min);
    onFilterChange('maxPrice', range.max);
  };

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  return (
    <>
      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isOpen 
          ? 'fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0'
          : 'hidden lg:block lg:relative lg:translate-x-0 lg:shadow-md lg:bg-white lg:rounded-xl lg:h-auto'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Price Range</h3>
            <PriceRangeSlider
              min={0}
              max={10000}
              value={priceRange}
              onChange={handlePriceRangeChange}
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.category === String(category.id)}
                    onChange={(e) => {
                      onFilterChange('category', e.target.checked ? category.id : '');
                    }}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.condition === condition.value}
                    onChange={(e) => {
                      onFilterChange('condition', e.target.checked ? condition.value : '');
                    }}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClearFilters}
            className="w-full btn-secondary mt-6"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;


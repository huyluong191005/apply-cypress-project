import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { getCategories, getBrands } from '../../utils/api';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        getCategories(),
        getBrands()
      ]);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : null,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : null
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating
    });
  };

  const handleStockChange = (inStock) => {
    onFilterChange({
      ...filters,
      inStock: filters.inStock === inStock ? null : inStock
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.inStock !== null;

  return (
    <div className="w-full lg:w-64 bg-white rounded-lg border border-gray-200 p-4 space-y-4 h-fit sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {categories.map((category) => (
            <Checkbox
              key={category}
              data-cy="category-filter"
              data-filter-value={category}
              id={`category-${category}`}
              label={category}
              checked={filters.categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              data-cy="price-min-input"
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="input-field text-sm"
            />
            <input
              data-cy="price-max-input"
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="input-field text-sm"
            />
          </div>
          <Button
            data-cy="price-filter-apply"
            variant="secondary"
            size="sm"
            onClick={handlePriceChange}
            className="w-full"
          >
            Apply
          </Button>
          <div className="space-y-1">
            <button
              onClick={() => {
                setPriceRange({ min: '0', max: '50' });
                onFilterChange({ ...filters, minPrice: 0, maxPrice: 50 });
              }}
              className="text-sm text-gray-600 hover:text-primary-600 block"
            >
              Under $50
            </button>
            <button
              onClick={() => {
                setPriceRange({ min: '50', max: '100' });
                onFilterChange({ ...filters, minPrice: 50, maxPrice: 100 });
              }}
              className="text-sm text-gray-600 hover:text-primary-600 block"
            >
              $50 - $100
            </button>
            <button
              onClick={() => {
                setPriceRange({ min: '100', max: '200' });
                onFilterChange({ ...filters, minPrice: 100, maxPrice: 200 });
              }}
              className="text-sm text-gray-600 hover:text-primary-600 block"
            >
              $100 - $200
            </button>
            <button
              onClick={() => {
                setPriceRange({ min: '200', max: '' });
                onFilterChange({ ...filters, minPrice: 200, maxPrice: null });
              }}
              className="text-sm text-gray-600 hover:text-primary-600 block"
            >
              $200+
            </button>
          </div>
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              data-cy="brand-filter"
              data-filter-value={brand}
              id={`brand-${brand}`}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <Checkbox
              key={rating}
              id={`rating-${rating}`}
              label={`${rating}+ Stars`}
              checked={filters.minRating === rating}
              onChange={() => handleRatingChange(rating)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection title="Availability">
        <div className="space-y-2">
          <Checkbox
            id="in-stock"
            label="In Stock"
            checked={filters.inStock === true}
            onChange={() => handleStockChange(true)}
          />
          <Checkbox
            id="out-of-stock"
            label="Out of Stock"
            checked={filters.inStock === false}
            onChange={() => handleStockChange(false)}
          />
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;

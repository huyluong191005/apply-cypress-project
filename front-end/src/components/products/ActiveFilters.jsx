import { X } from 'lucide-react';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFilters = [];

  // Add category filters
  filters.categories?.forEach((category) => {
    activeFilters.push({
      type: 'category',
      value: category,
      label: category
    });
  });

  // Add brand filters
  filters.brands?.forEach((brand) => {
    activeFilters.push({
      type: 'brand',
      value: brand,
      label: brand
    });
  });

  // Add price filter
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `$${filters.minPrice} - $${filters.maxPrice}`
      : filters.minPrice
      ? `From $${filters.minPrice}`
      : `Up to $${filters.maxPrice}`;
    activeFilters.push({
      type: 'price',
      label: priceLabel
    });
  }

  // Add rating filter
  if (filters.minRating) {
    activeFilters.push({
      type: 'rating',
      value: filters.minRating,
      label: `${filters.minRating}+ Stars`
    });
  }

  // Add stock filter
  if (filters.inStock !== null) {
    activeFilters.push({
      type: 'stock',
      value: filters.inStock,
      label: filters.inStock ? 'In Stock' : 'Out of Stock'
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
      {activeFilters.map((filter, index) => (
        <span
          key={`${filter.type}-${index}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
        >
          {filter.label}
          <button
            onClick={() => onRemoveFilter(filter.type, filter.value)}
            className="hover:text-primary-900"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;

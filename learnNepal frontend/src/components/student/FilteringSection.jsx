// Updated FilteringSection.js
import React from 'react';

// Update these categories to match your actual course categories
const categories = [
  'Development',
  'Business',
  'Design',
  'Marketing',
  'IT & Software',
];
const sortingOptions = ['Newest', 'Most Popular', 'Highest Rated'];
const reviewRatings = [
  { id: 'star5', label: '⭐⭐⭐⭐⭐', count: 0 },
  { id: 'star4', label: '⭐⭐⭐⭐☆', count: 0 },
  { id: 'star3', label: '⭐⭐⭐☆☆', count: 0 },
  { id: 'star2', label: '⭐⭐☆☆☆', count: 0 },
  { id: 'star1', label: '⭐☆☆☆☆', count: 0 },
];

const FilteringSection = ({
  selectedCategories,
  setSelectedCategories,
  selectedSort,
  setSelectedSort,
  selectedRatings,
  setSelectedRatings,
}) => {
  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category) // Remove if already selected
        : [...selectedCategories, category] // Add if not selected
    );
  };

  // Handle review selection
  const handleRatingChange = (rating) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSort('');
    setSelectedRatings([]);
  };

  return (
    <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Filters</h3>
        {(selectedCategories.length > 0 ||
          selectedSort ||
          selectedRatings.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800">
            Clear All
          </button>
        )}
      </div>

      {/* Course Category */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        Course Category
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {categories.map((category, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="w-4 h-4 accent-blue-500"
            />
            {category}
          </label>
        ))}
      </div>

      {/* Sorting Options */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Sort By</h3>
      <div className="flex flex-col gap-2 mb-6">
        {sortingOptions.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="sort"
              value={option}
              checked={selectedSort === option}
              onChange={() => setSelectedSort(option)}
              className="w-4 h-4 accent-blue-500"
            />
            {option}
          </label>
        ))}
      </div>

      {/* Review Ratings */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Rating</h3>
      <div className="flex flex-col gap-2">
        {reviewRatings.map((review) => (
          <label
            key={review.id}
            className="flex justify-between items-center text-gray-700 hover:text-blue-600 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRatings.includes(review.id)}
                onChange={() => handleRatingChange(review.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>{review.label}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 ||
        selectedSort ||
        selectedRatings.length > 0) && (
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Active Filters:</h4>

          {selectedCategories.length > 0 && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Categories: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedSort && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Sort: </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedSort}
              </span>
            </div>
          )}

          {selectedRatings.length > 0 && (
            <div>
              <span className="text-sm text-gray-600">Ratings: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRatings.map((rating, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {rating.replace('star', '') + ' Stars'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilteringSection;

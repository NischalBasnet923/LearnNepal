import React, { useState } from "react";

const categories = ["Category 1", "Category 2", "Category 3"];
const sortingOptions = ["Newest", "Most Popular", "Art & Graphic"];
const reviewRatings = [
  { id: "five", label: "⭐⭐⭐⭐⭐", count: 150 },
  { id: "four", label: "⭐⭐⭐⭐☆", count: 205 },
  { id: "three", label: "⭐⭐⭐☆☆", count: 25 },
  { id: "two", label: "⭐⭐☆☆☆", count: 5 },
  { id: "one", label: "⭐☆☆☆☆", count: 0 },
];

const FilteringSection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedReviews, setSelectedReviews] = useState([]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Remove if already selected
          : [...prev, category] // Add if not selected
    );
  };

  // Handle review selection
  const handleReviewChange = (review) => {
    setSelectedReviews((prev) =>
      prev.includes(review)
        ? prev.filter((r) => r !== review)
        : [...prev, review]
    );
  };

  return (
    <div className="p-6 w-full max-w-md">
      {/* Course Category */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Course Category
      </h3>
      <div className="flex flex-col gap-3">
        {categories.map((category, index) => (
          <label key={index} className="flex items-center gap-2 text-gray-700">
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
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Sort</h3>
      <div className="flex flex-col gap-3">
        {sortingOptions.map((option, index) => (
          <label key={index} className="flex items-center gap-2 text-gray-700">
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
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Review</h3>
      <div className="flex flex-col gap-3">
        {reviewRatings.map((review) => (
          <label
            key={review.id}
            className="flex justify-between items-center text-gray-700"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedReviews.includes(review.id)}
                onChange={() => handleReviewChange(review.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>{review.label}</span>
            </div>
            <span className="text-gray-500">({review.count})</span>
          </label>
        ))}
      </div>

      {/* Selected Filters Display */}
      <div className="mt-6">
        {selectedCategories.length > 0 && (
          <p className="text-gray-600">
            <strong>Categories:</strong> {selectedCategories.join(", ")}
          </p>
        )}
        {selectedSort && (
          <p className="text-gray-600">
            <strong>Sorted by:</strong> {selectedSort}
          </p>
        )}
        {selectedReviews.length > 0 && (
          <p className="text-gray-600">
            <strong>Reviews:</strong>{" "}
            {selectedReviews
              .map((id) => reviewRatings.find((r) => r.id === id)?.label)
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default FilteringSection;

import React, { useEffect, useState } from 'react';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/getCategory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCategories(data.category);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col h-auto px-6 md:px-16 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-10">
        <div>
          <p className="text-2xl md:text-3xl font-bold">Top Categories</p>
          <p className="text-sm md:text-base text-gray-500">
            Explore our Popular Categories
          </p>
        </div>
        <button className="bg-white text-black text-sm md:text-base mt-4 md:mt-0 h-10 px-6 md:px-8 border border-gray-400 rounded-full hover:bg-gray-100 transition">
          All Categories
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center px-4 md:px-10">
        {categories.slice(0, 10).map((category) => (
          <div
            key={category.id}
            className="w-[160px] md:w-[200px] lg:w-[220px] border rounded-xl flex flex-col justify-center items-center text-center p-6 shadow-md hover:shadow-lg transition transform hover:scale-105 duration-300 ease-in-out bg-white group"
            aria-labelledby={`category-title-${category.id}`}>
            <div className="mb-3 text-4xl text-blue-500">📚</div>
            <p
              id={`category-title-${category.id}`}
              className="text-base md:text-lg font-semibold mb-1 transition-colors duration-300 group-hover:text-blue-500">
              {category.categoryTitle}
            </p>
            <p className="text-sm text-gray-500">Category</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

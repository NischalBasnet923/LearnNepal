import React from "react";

const CategorySection = () => {
  const courses = [
    { id: 1, title: "Arts & Design", coursesCount: 38, icon: "🎨" },
    { id: 2, title: "Business", coursesCount: 22, icon: "💼" },
    { id: 3, title: "Computer Science", coursesCount: 50, icon: "💻" },
    { id: 4, title: "Mathematics", coursesCount: 30, icon: "➗" },
    { id: 5, title: "Literature", coursesCount: 15, icon: "📚" },
    { id: 6, title: "History", coursesCount: 18, icon: "🏛️" },
    { id: 7, title: "Development", coursesCount: 18, icon: "🔨" },
    { id: 8, title: "Communication", coursesCount: 18, icon: "📱" },
    { id: 9, title: "Videography", coursesCount: 18, icon: "📽️" },
    { id: 10, title: "Network", coursesCount: 18, icon: "📡" },
  ];

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
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-[160px] md:w-[200px] lg:w-[220px] border rounded-xl flex flex-col justify-center items-center text-center p-6 shadow-md hover:shadow-lg transition transform hover:scale-105 duration-300 ease-in-out bg-white group"
            aria-labelledby={`course-title-${course.id}`}
          >
            {/* Icon (Blue Color) */}
            <div className="mb-3 text-4xl text-blue-500">{course.icon}</div>

            {/* Course Title (Changes to Blue on Hover) */}
            <p
              id={`course-title-${course.id}`}
              className="text-base md:text-lg font-semibold mb-1 transition-colors duration-300 group-hover:text-blue-500"
            >
              {course.title}
            </p>

            {/* Course Count */}
            <p className="text-sm text-gray-500">
              {course.coursesCount} Courses
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

import React, { useContext, useState } from "react";
import FilteringSection from "../../components/student/FilteringSection";
import CourseCard from "../../components/student/CourseCard";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const coursesPerPage = 9; // Number of courses per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(allCourses.length / coursesPerPage);

  // Get the courses for the current page
  const displayedCourses = allCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar - Filter Section */}
        <div className="hidden md:block">
          <FilteringSection />
        </div>

        {/* Main Course List Section */}
        <div className="p-6 w-full md:w-3/4">
          {/* Header */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold">Courses</h2>
            <button className="py-2 px-6 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition md:hidden">
              Filter
            </button>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8 gap-6">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 rounded-full ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoursesList;

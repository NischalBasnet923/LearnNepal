// Updated CoursesList.js
import React, { useContext, useState, useEffect } from 'react';
import FilteringSection from '../../components/student/FilteringSection';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import Footer from '../../components/student/Footer';

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const coursesPerPage = 9; // Number of courses per page
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters to courses
  useEffect(() => {
    let result = [...allCourses];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((course) =>
        selectedCategories.includes(course.category)
      );
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      result = result.filter((course) => {
        const avgRating = calculateAverageRating(course);

        return selectedRatings.some((rating) => {
          const ratingValue = parseInt(rating.replace('star', ''));
          // Allow for a +/- 0.5 rating range to match the stars
          return (
            avgRating >= ratingValue - 0.5 && avgRating < ratingValue + 0.5
          );
        });
      });
    }

    // Sort courses
    if (selectedSort) {
      switch (selectedSort) {
        case 'Newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'Most Popular':
          result.sort(
            (a, b) =>
              (b.enrollments?.length || 0) - (a.enrollments?.length || 0)
          );
          break;
        case 'Highest Rated':
          result.sort(
            (a, b) => calculateAverageRating(b) - calculateAverageRating(a)
          );
          break;
        default:
          break;
      }
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allCourses, selectedCategories, selectedSort, selectedRatings]);

  // Calculate total pages based on filtered courses
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Update displayed courses when filtered courses or current page changes
  useEffect(() => {
    setDisplayedCourses(
      filteredCourses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
      )
    );
  }, [filteredCourses, currentPage, coursesPerPage]);

  // Calculate average rating for a course
  const calculateAverageRating = (course) => {
    if (!course.ratings || course.ratings.length === 0) return 0;

    const totalRating = course.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    return totalRating / course.ratings.length;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-end w-full mb-4">
          <button
            className="py-2 px-6 border rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
            onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Sidebar - Filter Section */}
        <div
          className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4`}>
          <FilteringSection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
          />
        </div>

        {/* Main Course List Section */}
        <div className="p-6 w-full md:w-3/4">
          {/* Header */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold">Courses</h2>
          </div>

          {/* No courses message */}
          {displayedCourses.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No courses found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSort('');
                  setSelectedRatings([]);
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Clear Filters
              </button>
            </div>
          )}

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
                    ? 'bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 rounded-full ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}>
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 rounded-full ${
                  currentPage === totalPages
                    ? 'bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
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

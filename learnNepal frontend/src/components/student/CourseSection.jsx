import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext) || { allCourses: [] }; // Prevents undefined error
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-auto px-6 md:px-16 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-10">
        <p className="text-2xl font-semibold mt-6">Courses</p>
        <button
          className="bg-white text-black text-sm md:text-base mt-2 md:mt-0 h-10 px-6 md:px-8 border border-gray-400 rounded-full hover:bg-gray-100 transition"
          onClick={() => navigate("/course-list")} // Navigates to "All Courses" page
        >
          All Courses
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
        {allCourses?.slice(0, 8).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseSection;

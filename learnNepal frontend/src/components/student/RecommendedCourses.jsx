import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const RecommendedCourses = () => {
  const { allCourses } = useContext(AppContext); // Ensure this matches AppContext structure

  return (
    <div className="flex flex-col h-auto px-6 md:px-16 py-16">
      <p className="text-2xl font-semibold mt-6">Recommended Course</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
        {/* Course Cards */}
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;

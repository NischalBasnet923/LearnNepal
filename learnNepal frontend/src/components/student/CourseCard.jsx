import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="border border-gray-300 rounded-xl shadow-md overflow-hidden">
      {/* Course Thumbnail */}
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="w-full h-[192px] object-cover rounded-t-xl"
      />

      {/* Course Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Course Title */}
        <h3 className="text-lg font-semibold">{course.courseTitle}</h3>

        {/* Instructor */}
        <p className="text-sm text-gray-500">
          by{" "}
          <span className="text-md font-semibold text-black">
            {course.teacher.username}
          </span>
        </p>

        {/* Course Duration */}
        <p className="text-sm text-black">🕐 {course.totalDuration} hours</p>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-black">
          <p>{calculateRating(course)}</p>
          {[...Array(5)].map((_, i) => (
            <p key={i}>
              {i < Math.floor(calculateRating(course)) ? "⭐" : "☆"}
            </p>
          ))}
          <p className="text-gray-500">{course.ratings.length}</p>
        </div>

        {/* Price Section */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2 items-center">
            <p className="text-gray-400 text-sm line-through">
              {currency}
              {course.coursePrice}
            </p>
            <p className="text-[#8CC63F] text-md font-semibold">
              {currency}
              {(
                course.coursePrice -
                (course.discount * course.coursePrice) / 100
              ).toFixed(2)}
            </p>
          </div>
          <button
            className="bg-white text-black text-sm font-medium px-4 py-1 border border-black rounded-md"
            onClick={() => {
              navigate(`/course/${course.id}`);
              window.scrollTo(0, 0);
            }}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

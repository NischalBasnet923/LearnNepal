import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import apiClient from "../../api/axios";

const MyEnrollment = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const {
    enrolledCourses,
    calculateCourseDuration,
    fetchUserEnrolledCourses,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const progress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await apiClient.get(
            "user/get-course-progress",
            {
              courseId: course.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          let totalLectures = calculateNoOfLectures(course);
          console.log(totalLectures)

          const lectureCompleted = data.progressData
            ? data.progressData.completed.length
            : 0;

          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(progress);
    } catch (error) {
      toastr.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserEnrolledCourses();
    }
  }, [user]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted * 100) /
                            progressArray[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  <p>{calculateCourseDuration(course)}</p>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures </span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600  max-sm:text-xs text-white"
                    onClick={() => navigate(`/player/` + course.id)}
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted /
                      progressArray[index].totalLectures ===
                      1
                      ? "Completed"
                      : "In Progress"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollment;

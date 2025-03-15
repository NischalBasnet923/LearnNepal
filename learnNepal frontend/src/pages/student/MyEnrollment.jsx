import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import apiClient from '../../api/axios';
import { Clock, BookOpen } from 'lucide-react';

const MyEnrollment = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const {
    enrolledCourses,
    calculateCourseDuration,
    fetchUserEnrolledCourses,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        setIsLoading(false);
        return;
      }

      const progressData = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const { data } = await apiClient.post(
              '/user/get-course-progress',
              { courseId: course.id },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            let totalLectures = calculateNoOfLectures(course);

            const lectureCompleted =
              data?.progress?.completedLectures?.length ?? 0;

            return { totalLectures, lectureCompleted };
          } catch (error) {
            return { totalLectures: 0, lectureCompleted: 0 }; // Return default values if error occurs
          }
        })
      );

      setProgressArray(progressData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setIsLoading(false);
    }
  };

  // Fix: Use useEffect with proper dependency handling
  useEffect(() => {
    let isMounted = true;

    if (user) {
      fetchUserEnrolledCourses();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fix: Add a separate effect for fetching progress
  useEffect(() => {
    let isMounted = true;

    if (enrolledCourses.length > 0) {
      fetchProgress();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // Fix: Remove calculateNoOfLectures from dependency to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses]);

  const getProgressColor = (percent) => {
    if (percent === 100) return '#10b981'; // Green for completed
    if (percent > 50) return '#3b82f6'; // Blue for good progress
    return '#f59e0b'; // Amber for started
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your learning journey by enrolling in a course.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => {
              // Fix: Handle potential undefined progressArray[index]
              const currentProgress = progressArray[index] || {
                totalLectures: 0,
                lectureCompleted: 1,
              };
              const progressPercent =
                currentProgress.totalLectures > 0
                  ? (currentProgress.lectureCompleted * 100) /
                    currentProgress.totalLectures
                  : 0;

              const isCompleted =
                currentProgress.totalLectures > 0 &&
                currentProgress.lectureCompleted ===
                  currentProgress.totalLectures;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle || 'Course thumbnail'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://via.placeholder.com/400x225?text=Course+Image';
                      }}
                    />
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="font-semibold text-xl text-gray-800 mb-3 line-clamp-2">
                      {course.courseTitle}
                    </h2>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <Line
                        strokeWidth={2}
                        strokeColor={getProgressColor(progressPercent)}
                        percent={progressPercent}
                        className="bg-gray-200 rounded-full"
                        trailWidth={2}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{calculateCourseDuration(course)}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>
                          {`${currentProgress.lectureCompleted}/${currentProgress.totalLectures} lectures`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/player/${course.id}`)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex justify-center items-center">
                      {currentProgress.lectureCompleted === 0
                        ? 'Start Learning'
                        : isCompleted
                        ? 'Review Course'
                        : 'Continue Learning'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollment;

import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import humanizeDuration from 'humanize-duration';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../../components/student/Rating';
import {
  PlayCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Award,
  ArrowLeft,
} from 'lucide-react';
import apiClient from '../../api/axios';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    fetchUserEnrolledCourses,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [totalLectures, setTotalLectures] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [rating, setRating] = useState(0); // Added missing rating state
  const videoRef = useRef(null);

  const user = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');

  const getCourseData = () => {
    const course = enrolledCourses.find((course) => course.id === courseId);
    if (course) {
      setCoursesData(course);

      // Set total lectures count
      const total = calculateNoOfLectures(course);
      setTotalLectures(total);

      // Set initial ratings
      if (user && course.ratings) {
        course.ratings.forEach((item) => {
          if (item.userId === JSON.parse(user).userId) {
            setInitialRating(item.rating);
            setRating(item.rating); // Also update the current rating state
          }
        });
      }

      // Set initial open sections and auto-select first video
      if (course.chapters && course.chapters.length > 0) {
        setOpenSections({ 0: true });

        // Auto-select first video if none is playing
        if (!playerData && course.chapters[0].lectures.length > 0) {
          const firstLecture = course.chapters[0].lectures[0];
          if (firstLecture.contentUrl) {
            setPlayerData({
              ...firstLecture,
              chapter: 1,
              lecture: 1,
            });
          }
        }
      }

      // Load initial course progress
      getCourseProgress();
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const markAsCompleted = async (chapterIndex, lectureIndex) => {
    try {
      if (
        !coursesData ||
        !coursesData.chapters ||
        !coursesData.chapters[chapterIndex] ||
        !coursesData.chapters[chapterIndex].lectures ||
        !coursesData.chapters[chapterIndex].lectures[lectureIndex]
      ) {
        return;
      }

      const lectureId =
        coursesData.chapters[chapterIndex].lectures[lectureIndex].id;

      if (!completedLectures.includes(lectureId)) {
        setCompletedLectures((prevCompleted) => [...prevCompleted, lectureId]);

        const payload = {
          courseId: courseId,
          lectureId: lectureId,
        };

        const { data } = await apiClient.post(
          '/user/update-course-progress',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success(data.message);
          getCourseProgress();
        } else {
          toast.error(data.message);
          setCompletedLectures((prevCompleted) =>
            prevCompleted.filter((id) => id !== lectureId)
          );
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update progress'
      );

      const lectureId =
        coursesData.chapters[chapterIndex].lectures[lectureIndex].id;
      setCompletedLectures((prevCompleted) =>
        prevCompleted.filter((id) => id !== lectureId)
      );
    }
  };

  const getCourseProgress = async () => {
    try {
      const payload = { courseId: courseId };
      const { data } = await apiClient.post(
        '/user/get-course-progress',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        // Update completed lectures from server data
        if (data.progress && data.progress.completedLectures) {
          setCompletedLectures(data.progress.completedLectures);

          // Calculate progress percentage if totalLectures is available
          if (totalLectures > 0) {
            const progressPercentage =
              (data.progress.completedLectures.length / totalLectures) * 100;
            setCurrentProgress(progressPercentage);
          } else {
            // If totalLectures is not yet available, calculate it from coursesData
            if (coursesData && coursesData.chapters) {
              const calculatedTotal = coursesData.chapters.reduce(
                (total, chapter) => total + chapter.lectures.length,
                0
              );
              const progressPercentage =
                (data.progress.completedLectures.length / calculatedTotal) *
                100;
              setCurrentProgress(progressPercentage);
            } else {
              // Default to 0 if we can't calculate yet
              setCurrentProgress(0);
            }
          }
        } else {
          // If no completed lectures data, set progress to 0
          setCurrentProgress(0);
        }
      } else {
        toast.error(data.message);
        setCurrentProgress(0);
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch progress'
      );
      setCurrentProgress(0);
    }
  };

  const handleVideoEnded = () => {
    if (playerData) {
      // Extract the proper chapter and lecture indices
      const chapterIndex = playerData.chapter - 1;
      const lectureIndex = playerData.lecture - 1;

      // Make sure these indices are valid
      if (chapterIndex >= 0 && lectureIndex >= 0) {
        markAsCompleted(chapterIndex, lectureIndex);
      }
    }
  };

  const isLectureCompleted = (chapterIndex, lectureIndex) => {
    const lectureId =
      coursesData.chapters[chapterIndex].lectures[lectureIndex].id;

    console.log('Checking if lecture is completed:', {
      lectureId,
      completedLectures,
    });

    return completedLectures.includes(lectureId);
  };

  // Update the useEffect for loading initial data
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses, courseId]);

  // Keep the effect for recalculating progress when completedLectures changes
  useEffect(() => {
    if (coursesData && totalLectures > 0) {
      const progressPercentage =
        (completedLectures.length / totalLectures) * 100;
      setCurrentProgress(progressPercentage);
    }
  }, [completedLectures, totalLectures, coursesData]);

  const handleRate = async (newRating) => {
    try {
      // Update the rating state with the new value
      setRating(newRating);

      const payload = { courseId: courseId, rating: newRating };
      const { data } = await apiClient.post('/user/add-rating', payload, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return coursesData ? (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Back button */}
      <div className="p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back to courses</span>
        </button>
      </div>

      {/* Main content area - full height minus the back button */}
      <div className="flex flex-1 overflow-hidden">
        {/* Course Structure Sidebar - LEFT - Scrollable */}
        <div className="w-1/3 flex flex-col bg-white border-r border-gray-200 shadow-lg overflow-y-auto">
          {/* Course title and progress */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            {coursesData && (
              <>
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {coursesData.courseTitle}
                </h1>
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${currentProgress}%` }}></div>
                  </div>
                  <span className="ml-2 min-w-16 text-right">
                    {Math.round(currentProgress)}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Course chapters list */}
          <div>
            {coursesData &&
              coursesData.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(index)}>
                    <div className="flex items-center space-x-2">
                      {openSections[index] ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                      <h3 className="font-medium text-gray-900">
                        {chapter.chapterTitle}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {chapter.lectures.length} lectures •{' '}
                      {calculateChapterTime(chapter)}
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 ${
                      openSections[index]
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                    <ul className="px-4 py-1">
                      {chapter.lectures.map((lecture, i) => {
                        const isCompleted = isLectureCompleted(index, i);
                        const isActive =
                          playerData &&
                          playerData.chapter === index + 1 &&
                          playerData.lecture === i + 1;

                        return (
                          <li
                            key={i}
                            className={`flex items-start py-3 px-2 rounded-md mb-1 ${
                              isActive
                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                : 'hover:bg-gray-50'
                            }`}>
                            <div className="pt-0.5 mr-3">
                              {isCompleted ? (
                                <CheckCircle
                                  size={18}
                                  className="text-green-500"
                                />
                              ) : (
                                <PlayCircle
                                  size={18}
                                  className={
                                    isActive ? 'text-blue-500' : 'text-gray-400'
                                  }
                                />
                              )}
                            </div>
                            <div className="flex flex-col w-full">
                              <p
                                className={`cursor-pointer hover:text-blue-600 text-sm ${
                                  isActive
                                    ? 'text-blue-600 font-medium'
                                    : isCompleted
                                    ? 'text-gray-600'
                                    : 'text-gray-800'
                                }`}
                                onClick={() =>
                                  lecture.contentUrl &&
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  })
                                }>
                                {lecture.title}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock size={12} className="mr-1" />
                                {humanizeDuration(
                                  lecture.duration * 60 * 1000,
                                  {
                                    units: ['h', 'm'],
                                  }
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right side content - Fixed */}
        <div className="w-2/3 flex flex-col bg-gray-900 overflow-hidden">
          {/* Video player - Reduced height */}
          <div className="h-3/5">
            {playerData ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                onEnded={handleVideoEnded}>
                <source src={playerData.contentUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                {coursesData ? (
                  <img
                    src={coursesData.courseThumbnail}
                    alt={coursesData.courseTitle}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <PlayCircle size={64} className="mx-auto mb-3 opacity-50" />
                    <p>Select a lecture to start learning</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video info panel - Expanded and fixed */}
          <div className="flex-1 bg-white overflow-y-auto">
            {playerData ? (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {playerData.title}
                    </h2>
                    <div className="flex items-center mt-2 text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        Chapter {playerData.chapter}, Lecture{' '}
                        {playerData.lecture}
                      </span>
                      {playerData.duration && (
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {humanizeDuration(playerData.duration * 60 * 1000, {
                            units: ['h', 'm'],
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {playerData.description && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-md text-gray-700 border border-gray-100">
                    {playerData.description}
                  </div>
                )}

                {/* Rating component */}
                <div className="mt-6 flex items-center gap-3">
                  <Award size={20} className="text-yellow-500" />
                  <span className="text-gray-700 font-medium">
                    Rate this lecture:
                  </span>
                  <Rating initialRating={initialRating} onRate={handleRate} />
                </div>

                {/* Additional content for the expanded area */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Notes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-md min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your notes about this lecture here..."></textarea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-gray-500">
                <div>
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Select a lecture
                  </h3>
                  <p>Choose a lecture from the sidebar to start learning</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Player;

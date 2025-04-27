import React, { useContext, useEffect, useState } from 'react';
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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const user = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');

  const getCourseData = () => {
    const course = enrolledCourses.find((course) => course.id === courseId);
    if (course) {
      console.log('Fetched course data:', course);
      setCoursesData(course);

      // Set total lectures count
      const total = calculateNoOfLectures(course);
      setTotalLectures(total);

      // Set initial ratings and comments
      if (user && course.ratings) {
        course.ratings.forEach((item) => {
          if (item.userId === JSON.parse(user).userId) {
            setInitialRating(item.rating);
            setRating(item.rating);
            if (item.comment) {
              setComment(item.comment);
            }
          }
        });
      }

      // Set initial open sections and auto-select first video
      if (course.chapters && course.chapters.length > 0) {
        setOpenSections({ 0: true });
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

  // Handle rating change from the Rating component
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Handle submission of rating and comment
  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }

    try {
      const payload = {
        courseId: courseId,
        rating: rating,
        comment: comment,
      };

      const { data } = await apiClient.post('/user/add-rating', payload, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();

        // Update initial rating to match current rating
        setInitialRating(rating);

        // Clear comment field after successful submission if it's a new rating
        if (data.message.includes('added')) {
          setComment('');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to submit rating'
      );
    }
  };

  const handleCertificateDownload = () => {
    const certificateData = {
      studentName: JSON.parse(user)?.username || 'John Doe',
      courseName: coursesData.courseTitle || 'Advanced Web Development',
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      certificateId: `LNPL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      instructorName: coursesData.teacher.username || 'Dr. Sarah Johnson',
      hoursCompleted: `${Math.round(totalLectures * 1)}`, // Assuming 1 hour per lecture
      grade: 'Excellence',
    };
    navigate('/player/certificate', { state: certificateData });
  };

  return coursesData ? (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with Back button and Course Progress */}
      <div className="py-3 px-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back to courses</span>
        </button>

        {/* Course progress in header for better visibility */}
        {coursesData && (
          <div className="flex items-center ml-6 max-w-md w-full">
            <div className="flex-grow text-sm font-medium text-gray-700 mr-3">
              {coursesData.courseTitle}
            </div>
            <div className="w-32 h-2.5 bg-gray-200 rounded-full">
              <div
                className="h-2.5 bg-blue-600 rounded-full"
                style={{ width: `${currentProgress}%` }}></div>
            </div>
            <span className="ml-3 min-w-12 text-right text-sm font-medium text-gray-700">
              {Math.round(currentProgress)}%
            </span>
          </div>
        )}
      </div>

      {/* Main content area - Flexible layout that adapts well to different screen sizes */}
      <div className="flex flex-1 overflow-hidden">
        {/* Course Structure Sidebar - Now collapsible with toggle button */}
        <div className="relative w-1/4 flex flex-col bg-white border-r border-gray-200 shadow-md overflow-y-auto">
          {/* Course title area */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            {coursesData && (
              <h1 className="text-lg font-bold text-gray-900 truncate">
                Course Content
              </h1>
            )}
          </div>

          {/* Course chapters list */}
          <div className="flex-1 overflow-y-auto">
            {coursesData &&
              coursesData.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(index)}>
                    <div className="flex items-center space-x-2.5">
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
                            className={`flex items-start py-3 px-3 rounded-md mb-1.5 ${
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
                                onClick={() => {
                                  const clickedLecture = {
                                    id: lecture.id,
                                    title: lecture.title,
                                    contentUrl: lecture.contentUrl,
                                    duration: lecture.duration,
                                    description: lecture.description,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  };
                                  console.log(
                                    'Lecture clicked:',
                                    clickedLecture
                                  );
                                  setPlayerData(clickedLecture);
                                }}>
                                {lecture.title}
                              </p>
                              <div className="flex items-center mt-1.5 text-xs text-gray-500">
                                <Clock size={12} className="mr-1.5" />
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

        {/* Main content with tabs for better organization */}
        <div className="w-3/4 flex flex-col bg-gray-100 overflow-hidden">
          {/* Video player - Full width and responsive height */}
          <div className="bg-black h-2/5">
            {playerData ? (
              <video
                key={playerData.contentUrl}
                className="w-full h-full object-contain"
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
                    <PlayCircle size={72} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      Select a lecture to start learning
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabbed interface for better organization */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {playerData ? (
              <>
                {/* Tab navigation */}
                <div className="flex border-b border-gray-200">
                  <button className="py-4 px-6 text-blue-600 border-b-2 border-blue-600 font-medium">
                    Lecture Info
                  </button>
                </div>

                {/* Content area with overflow scroll */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Lecture title and meta info */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {playerData.title}
                      </h2>
                      <div className="flex items-center mt-2 text-sm text-gray-600 space-x-5">
                        <span className="flex items-center">
                          <BookOpen size={16} className="mr-1.5" />
                          Chapter {playerData.chapter}, Lecture{' '}
                          {playerData.lecture}
                        </span>
                        {playerData.duration && (
                          <span className="flex items-center">
                            <Clock size={16} className="mr-1.5" />
                            {humanizeDuration(playerData.duration * 60 * 1000, {
                              units: ['h', 'm'],
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description card */}
                  {playerData.description && (
                    <div className="mt-4 p-5 bg-gray-50 rounded-lg text-gray-700 border border-gray-100">
                      <h3 className="text-md font-medium mb-2">Description</h3>
                      <p>{playerData.description}</p>
                    </div>
                  )}

                  {/* Quick notes section - Always visible */}
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">
                      Quick Notes
                    </h3>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Take quick notes while watching..."></textarea>
                  </div>

                  {/* Progress indicators and certificate section side by side */}
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    {/* Course progress card */}
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="text-md font-medium text-gray-800 mb-3">
                        Your Progress
                      </h3>
                      <div className="flex items-center mt-2">
                        <div className="w-full h-2.5 bg-gray-200 rounded-full">
                          <div
                            className="h-2.5 bg-blue-600 rounded-full"
                            style={{ width: `${currentProgress}%` }}></div>
                        </div>
                        <span className="ml-3 font-medium text-blue-600">
                          {Math.round(currentProgress)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Keep going! You're making great progress in this course.
                      </p>
                    </div>

                    {/* Certificate section */}
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">🎓</span> Certificate
                      </h3>
                      {currentProgress === 100 ? (
                        <>
                          <p className="text-gray-600 mb-4">
                            You have completed the course!
                          </p>
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            onClick={handleCertificateDownload}>
                            Download Certificate
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-500">
                            Complete the course to unlock your certificate.
                          </p>
                          <div className="flex items-center mt-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-gray-400 rounded-full"
                                style={{ width: `${currentProgress}%` }}></div>
                            </div>
                            <span className="ml-3 text-sm text-gray-500">
                              {Math.round(100 - currentProgress)}% to go
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating section */}
                  <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Award size={22} className="text-yellow-500" />
                      <span className="text-gray-700 font-medium">
                        How would you rate this lecture?
                      </span>
                      <Rating
                        initialRating={initialRating}
                        onRatingChange={handleRatingChange}
                      />
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your thoughts about this lecture..."></textarea>

                    <button
                      onClick={submitRating}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      disabled={rating < 1}>
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-gray-500">
                <div>
                  <BookOpen size={52} className="mx-auto mb-5 opacity-50" />
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Select a lecture to begin
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Choose a lecture from the sidebar to start learning
                  </p>
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

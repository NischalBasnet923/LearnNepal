import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import time from '../../assets/image/time_left.svg';
import rating from '../../assets/image/rating_star.svg';
import stripe from '../../assets/image/stripe.png';
import khalti from '../../assets/image/khalti.png';
import null_star from '../../assets/image/star_dull_icon.svg';
import time_clock from '../../assets/image/time_clock_icon.svg';
import book from '../../assets/image/lesson_icon.svg';
import Footer from '../../components/student/Footer';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [userData, setUserData] = useState({});
  const [coursesData, setCoursesData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [usersMap, setUsersMap] = useState({}); // Store user data for ratings

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
  } = useContext(AppContext);

  const fetchUserData = async () => {
    try {
      const { data } = await apiClient.get('/user', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Show error message if user data fails to load
      toast.error(error.message);
    }
  };

  const fetchCourseData = async () => {
    try {
      const { data } = await apiClient.get('/course/' + courseId);
      if (data.success) {
        setCoursesData(data.courseData);

        // Fetch user information for each rating
        if (data.courseData.ratings && data.courseData.ratings.length > 0) {
          fetchRatingUsers(data.courseData.ratings);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user information for ratings
  const fetchRatingUsers = async (ratings) => {
    try {
      const userIds = ratings.map((rating) => rating.userId);
      const uniqueUserIds = [...new Set(userIds)];

      const users = {};

      // In a real app, this would be a batch request to fetch multiple users
      // For simplicity, we're doing it one by one
      for (const userId of uniqueUserIds) {
        const { data } = await apiClient.get(`/user/${userId}`);
        if (data.success) {
          users[userId] = data.user;
        }
      }

      setUsersMap(users);
    } catch (error) {
      console.error('Error fetching user information for ratings:', error);
    }
  };

  const handlePayment = async (method) => {
    try {
      // Must login first
      if (!userData) {
        return toast.warn('Please login to enroll in the course');
      }
      // If user is already enrolled
      if (isAlreadyEnrolled) {
        return toast.warn('You are already enrolled in this course');
      }

      // Payment Endpoint => Stripe or Khalti
      const token = localStorage.getItem('token');
      const paymentEndpoint =
        method === 'stripe' ? '/user/purchase' : '/purchase-course/khalti';

      // Send the courseId to backend
      const { data } = await apiClient.post(
        paymentEndpoint,
        { courseId },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      // If success => redirect to payment link
      if (data.success) {
        const session_url = data.session_url || data.payment_url;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setShowPaymentPopup(false); // Hide the popup no matter what
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && coursesData) {
      const isEnrolled = userData.enrollments.some(
        (enrollment) => enrollment.courseId === coursesData.id
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [userData, coursesData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg">
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return coursesData ? (
    <>
      {/* Main Container */}
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-[390px] -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        <div className="max-w-xl z-10 text-gray-500">
          {/* Course Title */}
          <h1 className="md:text-[44px] text-[36px] font-semibold text-gray-800">
            {coursesData.courseTitle}
          </h1>

          {/* Course Description (first 200 chars) */}
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: coursesData.courseDescription.slice(0, 200),
            }}></p>

          <div className="flex items-center  space-x-2 pt-3 pb-1 text-sm">
            {/* Overall Rating */}
            <p>{calculateRating(coursesData)}</p>

            {/* Star Icons (★ / ☆) */}
            {[...Array(5)].map((_, i) => (
              <p key={i}>
                {i < Math.floor(calculateRating(coursesData)) ? '⭐' : '☆'}
              </p>
            ))}
            {/* # of Ratings */}
            <p className="text-blue-600">
              ({coursesData.ratings.length}{' '}
              {coursesData.ratings.length > 1 ? 'ratings' : 'rating'})
            </p>
            {/* # of Students Enrolled */}
            <p>
              {coursesData.enrollments.length}{' '}
              {coursesData.enrollments.length > 1 ? 'students' : 'student'}
            </p>
          </div>

          {/* Teacher Name */}
          <p>
            Course by{' '}
            <span className="text-blue-600 underline">
              {coursesData.teacher.username}
            </span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            {/* Chapters Loop */}
            <div className="pt-5">
              {coursesData.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded">
                  {/* Chapter Title */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}>
                    <div className="flex items-center gap-2 px-2">
                      <p
                        className={`transform transition-transform ${
                          openSections[index] ? 'rotate-180' : ''
                        }`}>
                        {} ▾{' '}
                      </p>
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-sm md:text-default">
                      {chapter.lectures.length} lectures -{' '}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? 'max-h-96' : 'max-h-0'
                    }`}>
                    <ul className="list-disc md:pl-10 pl-44 pr-444 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.lectures.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <p> ▶️ </p>
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            {/* Lecture Title */}
                            <p>{lecture.title} </p>
                            <div className="flex gap-2">
                              {/* Preview Link => sets playerData */}
                              {lecture.isPreview && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoUrl: lecture.contentUrl,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer">
                                  Preview
                                </p>
                              )}
                              {/* Lecture Duration */}
                              <p>
                                {humanizeDuration(
                                  lecture.duration * 60 * 1000,
                                  { units: ['h', 'm'] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Ratings and Reviews Section */}
          <div className="py-10 text-gray-800">
            <h2 className="text-xl font-semibold mb-6">
              Student Ratings & Reviews
            </h2>

            {coursesData.ratings && coursesData.ratings.length > 0 ? (
              <div className="space-y-6">
                {coursesData.ratings.map((ratingItem) => (
                  <div
                    key={ratingItem.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {usersMap[ratingItem.userId]?.username?.charAt(0) ||
                            '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {usersMap[ratingItem.userId]?.username || 'Student'}
                          </p>
                          <div className="flex items-center text-amber-400 mt-1">
                            {renderStars(ratingItem.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(
                          ratingItem.createdAt || new Date()
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {ratingItem.comment && (
                      <div className="mt-3 text-gray-700">
                        <p>{ratingItem.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  No ratings yet. Be the first to rate this course!
                </p>
              </div>
            )}
          </div>

          {/* Additional Course Description (Full) */}
          <div className="py-10 text-sm md:text-default ">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: coursesData.courseDescription,
              }}></p>
          </div>
        </div>

        <div className="max-w-[424px] z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <video className="w-full aspect-video" controls autoPlay>
              {/* Source is your uploaded video URL (MP4) */}
              <source src={playerData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // If no video selected, show course thumbnail
            <img src={coursesData.courseThumbnail} alt="" />
          )}

          <div className="p-5">
            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}
                {(
                  coursesData.coursePrice -
                  (coursesData.discount * coursesData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency}
                {coursesData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {coursesData.discount}% off
              </p>
            </div>

            {/* RATING / CLOCK / LESSONS */}
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              {/* RATING */}
              <div className="flex items-center gap-1">
                <img
                  src={coursesData.ratings.length > 0 ? rating : null_star}
                  alt="start icon"
                />
                <p>{calculateRating(coursesData)}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"></div>

              {/* TIME CLOCK */}
              <div className="flex items-center gap-1">
                <img src={time_clock} alt="clock icon" />
                <p>{calculateCourseDuration(coursesData)}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"></div>

              {/* NUMBER OF LESSONS */}
              <div className="flex items-center gap-1">
                <img src={book} alt="book icon" />
                <p>{calculateNoOfLectures(coursesData)} lessons</p>
              </div>
            </div>

            {/* Enroll Button => opens Payment Popup */}
            <button
              onClick={() => setShowPaymentPopup(true)}
              className={`md:mt-6 mt-4 w-full py-3 rounded font-medium ${
                isAlreadyEnrolled
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isAlreadyEnrolled}>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>

      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Choose Payment Method
            </h2>

            {/* Payment Options */}
            <div className="flex justify-center gap-4">
              {/* Stripe Payment Button */}
              <button
                onClick={() => handlePayment('stripe')}
                className="bg-gray-100 hover:bg-gray-200 transition-all px-6 py-6 rounded-lg flex flex-col items-center justify-center shadow-md w-36">
                <img src={stripe} alt="Stripe" className="w-20 h-auto" />
              </button>

              {/* Khalti Payment Button */}
              <button
                onClick={() => handlePayment('khalti')}
                className="bg-purple-100 hover:bg-purple-200 transition-all px-6 py-3 rounded-lg flex flex-col items-center justify-center shadow-md w-36">
                <img src={khalti} alt="Khalti" className="w-20 h-auto" />
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowPaymentPopup(false)}
              className="mt-6 text-gray-600 hover:text-red-500 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

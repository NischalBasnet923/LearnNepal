import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { useSocketContext } from '../../../socketContext';
import { useNavigate } from 'react-router-dom';
import { Line } from 'rc-progress';
import apiClient from '../../api/axios';
import {
  Clock,
  BookOpen,
  MessageSquare,
  Send,
  X,
  ChevronDown,
} from 'lucide-react';

const MyEnrollment = () => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (socket && selectedCourse) {
      const handleReceiveMessage = (message) => {
        if (
          selectedCourse.teacher &&
          (message.senderId === selectedCourse.teacher.id ||
            message.receiverId === selectedCourse.teacher.id)
        ) {
          setChatMessages((prevMessages) => [...prevMessages, message]);

          if (isChatMinimized) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket, selectedCourse, isChatMinimized]);

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
            return { totalLectures: 0, lectureCompleted: 0 };
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

  const fetchChatHistory = async (receiverId) => {
    try {
      setIsLoadingMessages(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiClient.post(
        '/chat/getMessage',
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setChatMessages(response.data.data);
      } else {
        setChatMessages([]);
      }
      setIsLoadingMessages(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setChatMessages([]);
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (receiverId, message) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await apiClient.post(
        '/chat/sendMessage',
        { receiverId, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const newMsg = response.data.data;

        setChatMessages((prevMessages) => [...prevMessages, newMsg]);

        if (socket) {
          socket.emit('sendMessage', {
            senderId: user.id,
            receiverId: receiverId,
            message: message,
            createdAt: new Date().toISOString(),
            courseId: selectedCourse?.id,
          });
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserEnrolledCourses();
    }
  }, []);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchProgress();
    } else {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (selectedCourse && selectedCourse.teacher && selectedCourse.teacher.id) {
      fetchChatHistory(selectedCourse.teacher.id);
    }
  }, [selectedCourse]);

  const getProgressColor = (percent) => {
    if (percent === 100) return '#10b981';
    if (percent > 50) return '#3b82f6';
    return '#f59e0b';
  };

  const openChat = (course) => {
    setSelectedCourse(course);
    setIsChatOpen(true);
    setIsChatMinimized(false);
    setUnreadCount(0);

    if (course.teacher && course.teacher.id) {
      fetchChatHistory(course.teacher.id);
    } else {
      console.error('No teacher ID found for this course');
      setChatMessages([]);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedCourse(null);
    setChatMessages([]);
    setUnreadCount(0);
  };

  const toggleMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
    if (!isChatMinimized) {
      setUnreadCount(0);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !selectedCourse ||
      !selectedCourse.teacher ||
      !selectedCourse.teacher.id
    )
      return;

    const success = await sendMessage(selectedCourse.teacher.id, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTeacherName = () => {
    if (selectedCourse && selectedCourse.teacher) {
      return (
        selectedCourse.teacher.name ||
        selectedCourse.teacher.username ||
        'Course Teacher'
      );
    }
    return 'Course Teacher';
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

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/player/${course.id}`)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex justify-center items-center">
                        {currentProgress.lectureCompleted === 0
                          ? 'Start Learning'
                          : isCompleted
                          ? 'Review Course'
                          : 'Continue Learning'}
                      </button>

                      <button
                        onClick={() => openChat(course)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition duration-200 flex justify-center items-center"
                        title="Chat with Teacher">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isChatOpen && (
        <>
          {isChatMinimized ? (
            <div
              className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50 hover:bg-blue-700 transition-all duration-300"
              onClick={toggleMinimize}>
              <MessageSquare className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
          ) : (
            <div className="fixed bottom-0 right-6 w-80 bg-white rounded-t-lg shadow-xl z-50 flex flex-col h-96">
              <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <h3 className="font-medium truncate">
                    {getTeacherName()} -{' '}
                    {selectedCourse?.courseTitle || 'Course Discussion'}
                  </h3>
                </div>
                <div className="flex items-center">
                  <div className="cursor-pointer mr-2" onClick={toggleMinimize}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div className="cursor-pointer" onClick={closeChat}>
                    <X className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No messages yet</p>
                    <p className="text-sm">
                      Send a message to start the conversation!
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isCurrentUser = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {formatTimestamp(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoadingMessages || !selectedCourse?.teacher?.id}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyEnrollment;

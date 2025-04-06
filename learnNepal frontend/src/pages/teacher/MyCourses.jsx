import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import {
  Edit,
  ExternalLink,
  BookOpen,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchCourses = async () => {
    // Sort courses by creation date (newest first)
    const sortedCourses = [...allCourses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setCourses(sortedCourses);
  };

  useEffect(() => {
    if (allCourses) {
      fetchCourses();
    }
  }, [allCourses]);

  const handleSort = (order) => {
    setSortOrder(order);
    let sortedCourses = [...courses];

    switch (order) {
      case 'newest':
        sortedCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 'oldest':
        sortedCourses.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case 'earnings':
        sortedCourses.sort((a, b) => {
          const earningsA =
            a.enrollments.length *
            (a.coursePrice - (a.discount * a.coursePrice) / 100);
          const earningsB =
            b.enrollments.length *
            (b.coursePrice - (b.discount * b.coursePrice) / 100);
          return earningsB - earningsA;
        });
        break;
      case 'students':
        sortedCourses.sort(
          (a, b) => b.enrollments.length - a.enrollments.length
        );
        break;
      default:
        break;
    }

    setCourses(sortedCourses);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return courses ? (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <div className="flex space-x-2">
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="earnings">Highest Earnings</option>
              <option value="students">Most Students</option>
            </select>
            <Link
              to="/teacher/add-course"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Create New Course
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 gap-6 sm:hidden">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {course.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Published {formatDate(course.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Users size={16} className="mr-2" />
                    <span>{course.enrollments.length} students</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign size={16} className="mr-2" />
                    <span>
                      {currency}{' '}
                      {Math.floor(
                        course.enrollments.length *
                          (course.coursePrice -
                            (course.discount * course.coursePrice) / 100)
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/dashboard/edit-course/${course.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Edit size={16} className="mr-2" /> Edit
                  </Link>
                  <Link
                    to={`/course/${course.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <ExternalLink size={16} className="mr-2" /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      Earnings
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      Students
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Published
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-20">
                          <img
                            className="h-12 w-20 object-cover rounded"
                            src={course.courseThumbnail}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                            {course.courseTitle}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <BookOpen size={12} className="mr-1" />
                            {course.chapters?.length || 0} chapters
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {currency}{' '}
                        {Math.floor(
                          course.enrollments.length *
                            (course.coursePrice -
                              (course.discount * course.coursePrice) / 100)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.enrollments.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(course.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/teacher/update-course/${course.id}`}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-md"
                          title="Edit course">
                          <Edit size={18} />
                        </Link>
                        <Link
                          to={`/course/${course.id}`}
                          className="text-blue-600 hover:text-blue-800 bg-blue-100 p-2 rounded-md"
                          title="View course">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new course.
              </p>
              <div className="mt-6">
                <Link
                  to="/teacher/add-course"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create New Course
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;

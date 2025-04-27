import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  BookOpen,
  Users,
  Award,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import apiClient from '../../api/axios';

const TeacherReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/getReport', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setReport(res.data.report);
        } else {
          setError('Failed to load report data');
        }
      } catch (error) {
        console.error('Failed to fetch report:', error);
        setError('An error occurred while fetching the report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  // Prepare chart data
  const prepareChartData = () => {
    if (!report) return [];
    return report.courseDetails.map((course) => ({
      name:
        course.title.length > 15
          ? course.title.substring(0, 15) + '...'
          : course.title,
      earnings: course.monthlyEarnings,
      enrollments: course.enrollments,
    }));
  };

  const StatCard = ({ icon, title, value, color = 'bg-blue-500' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`${color} text-white p-4 rounded-lg mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {course.title}
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <Users size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">
              {course.enrollments} students
            </span>
          </div>
          <div className="flex items-center">
            <Award size={16} className="text-amber-500 mr-2" />
            <span className="text-sm text-gray-600">
              {course.averageRating
                ? `${course.averageRating.toFixed(1)} rating`
                : 'No ratings'}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="font-semibold text-gray-800">
              Rs. {course.monthlyEarnings.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Yearly</p>
            <p className="font-semibold text-gray-800">
              Rs. {course.yearlyEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Report
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Report</h1>
          <p className="text-gray-600">
            Overview of your teaching performance and earnings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen size={24} />}
            title="Total Courses"
            value={report.totalCourses}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Users size={24} />}
            title="Total Enrollments"
            value={report.totalEnrollments}
            color="bg-green-500"
          />
          <StatCard
            icon={<Calendar size={24} />}
            title="Monthly Earnings"
            value={`Rs. ${report.totalEarnings.monthly.toFixed(2)}`}
            color="bg-purple-500"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            title="Yearly Earnings"
            value={`Rs. ${report.totalEarnings.yearly.toFixed(2)}`}
            color="bg-amber-500"
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Course Performance
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#3b82f6" name="Enrollments" />
                <Bar dataKey="earnings" fill="#8b5cf6" name="Earnings (Rs.)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Breakdown */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Course Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.courseDetails.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReport;

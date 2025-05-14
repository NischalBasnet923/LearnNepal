import React from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import Home from './pages/student/Home';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollment from './pages/student/MyEnrollment';
import Player from './pages/student/Player';
import Loading from './components/student/Loading';
import Certificate from './pages/student/Certificate';
import Teacher from './pages/teacher/Teacher';
import Dashboard from './pages/teacher/Dashboard';
import AddCourse from './pages/teacher/AddCourse';
import MyCourses from './pages/teacher/MyCourses';
import StudentEnrolled from './pages/teacher/StudentEnrolled';
import Report from './pages/teacher/TeacherReport';
import Navbar from './components/student/Navbar';
import Signin from './pages/authentication/Signin';
import Auth from './pages/authentication/Auth';
import Signup from './pages/authentication/Signup';
import ForgotPassword from './pages/authentication/ForgotPass';
import OTP from './pages/authentication/OTP';
import PasswordChange from './pages/authentication/PassChange';
import Admin from './pages/admin/Admin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Request from './pages/admin/Request';
import TeacherRequestDetails from './pages/admin/TeacherRequestDetails';
import TagSelector from './pages/student/TagSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'quill/dist/quill.snow.css';
import VerifyTeacher from './pages/teacher/verfiyTeacher';
import Chat from './pages/teacher/Chat';
import UpdateCourse from './pages/teacher/UpdateCourse';

const App = () => {
  const isTeacherRoute = useMatch('/teacher/*');
  const isAuthenticatedRoute = useMatch('/auth/*');
  const isAdminRoute = useMatch('/admin/*');
  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isTeacherRoute && !isAuthenticatedRoute && !isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollment />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/teacherRequest" element={<VerifyTeacher />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/player/certificate" element={<Certificate />} />
        <Route path="/teacher" element={<Teacher />}>
          <Route path="/teacher" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="message" element={<Chat />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
          <Route path="report" element={<Report />} />
          <Route path="update-course/:id" element={<UpdateCourse />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="request" element={<Request />} />
          <Route
            path="teacher-request/:id"
            element={<TeacherRequestDetails />}
          />
        </Route>
        <Route path="/auth" element={<Auth />}>
          <Route path="signin" element={<Signin />} />
          <Route path="tagSelector" element={<TagSelector />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="otp" element={<OTP />} />
          <Route path="change-password" element={<PasswordChange />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

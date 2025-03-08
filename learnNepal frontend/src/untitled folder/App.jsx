import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollment from "./pages/student/MyEnrollment";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";
import Teacher from "./pages/teacher/Teacher";
import Dashboard from "./pages/teacher/Dashboard";
import AddCourse from "./pages/teacher/AddCourse";
import MyCourses from "./pages/teacher/MyCourses";
import StudentEnrolled from "./pages/teacher/StudentEnrolled";
import Navbar from "./components/student/Navbar";
import Signin from "./pages/authentication/Signin";
import Auth from "./pages/authentication/Auth";
import Signup from "./pages/authentication/Signup";
import ForgotPassword from "./pages/authentication/ForgotPass";
import OTP from "./pages/authentication/OTP";
import PasswordChange from "./pages/authentication/PassChange";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";

const App = () => {
  const isTeacherRoute = useMatch("/teacher/*");
  const isAuthenticatedRoute = useMatch("/auth/*");
  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isTeacherRoute && !isAuthenticatedRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollment />} />
        <Route path="/player/:videoId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/teacher" element={<Teacher />}>
          <Route path="teacher" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
        <Route path="/auth" element={<Auth />}>
          <Route path="signin" element={<Signin />} />
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

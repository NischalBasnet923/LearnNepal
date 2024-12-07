import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Signin } from "./Page/Signin";
import { ForgotPass } from "./Page/ForgotPass";
import { OTP } from "./Page/OTP";
import { PassChange } from "./Page/PassChange";
import NotFound from "./Page/NotFound";
import { Signup } from "./Page/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Page/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:3000/api/verifytoken", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            toast.error("Session expired. Please sign in again.");
          }
        } catch (error) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please sign in again.");
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route
          path="/"
          element={!isAuthenticated ? <Signin /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/home" />}
        />
        <Route
          path="/forgot-password"
          element={!isAuthenticated ? <ForgotPass /> : <Navigate to="/home" />}
        />

        <Route
          path="/otp"
          element={!isAuthenticated ? <OTP /> : <Navigate to="/home" />}
        />
        <Route
          path="/change-password"
          element={!isAuthenticated ? <PassChange /> : <Navigate to="/home" />}
        />
        {/* Routes for OTP and Password Change */}

        {/* Routes for authenticated users */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" />}
        />

        {/* 404 Page */}
        <Route path="/404" element={<NotFound />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

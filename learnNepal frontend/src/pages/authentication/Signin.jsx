import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image/sign.png";
import CustomButton from "../../components/basic components/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../api/axios";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevents page reload

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }
    const payload = { email, password };
    console.log(payload);

    try {
      const response = await apiClient.post("/login", payload);
      console.log("Response:", response.data);

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);
      console.log("Role:", response.data.user.role);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl rounded-xl">
      <div className="w-[500px] rounded-2xl px-10 py-10 pb-14 text-center border border-gray-100">
        <div className="text-center mb-5 flex flex-col gap-2">
          <img src={logo} alt="logo" className="h-[40px] self-center mb-2" />
          <div>
            <h3 className="text-lg font-medium">Sign In to LearnNepal</h3>
            <p className="text-sm text-gray-500">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Sign-in Form UI Only (No Logic) */}
          <form onSubmit={handleSubmit}>
            <div className="text-sm text-gray-500 mb-2 text-left">Email</div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
              required
            />

            <div className="text-sm text-gray-500 mb-2 text-left">Password</div>
            <input
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
              required
            />

            <div className="text-sm text-black mb-4 text-right">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Sign In Button */}
            <CustomButton text="Sign In" type="submit" />

            <div className="py-2">
              <span className="text-gray-500">or</span>
            </div>

            <div className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-black">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;

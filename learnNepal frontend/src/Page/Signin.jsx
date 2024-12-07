import React, { useState } from "react";
import logo from "../assets/sign.png";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/button/button";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const payload = { email, password };

    try {
      const response = await axios.post('http://localhost:3000/api/login', payload);
      localStorage.setItem('token', response.data.token); // Save token in local storage
      toast.success("Login Successful", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/home'); // Navigate to the home page
    } catch (error) {
      console.log("Login Failed", error);
      toast.error("Failed to login!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
            <CustomButton text="Sign In" onClick={handleSubmit} />

            <div className="py-2">
              <span className="text-gray-500">or</span>
            </div>
            <div className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-black">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

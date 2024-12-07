import React, { useState } from "react";
import { loginData } from "../constants/textdata";
import CustomButton from "../components/button/button";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signup = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Correctly initialize the navigate function

  const handleClick = async (e) => {
    e.preventDefault();
    const payload = {
      username: username,
      email: email,
      password: password,
    };
    console.log(payload);

    try {
      const response = await axios.post('http://localhost:3000/api/register', payload);
      toast.success(response.data.message);
      navigate('/'); // Use navigate to redirect to the sign-in page
    } catch (error) {
      toast.error("Failed to register");
      console.log(error);
    }
  };
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex gap-10">
        <div className=" w-[400px] flex flex-col gap-6 py-40">
          <img
            src={logo}
            alt="logo"
            className="w-[70px] h-[100px] self-center pb-6"
          />
          <div className="">
            <h5 className="text-lg font-semibold">{loginData.Header[0]}</h5>
            <p>{loginData.SubHeader[0]}</p>
          </div>
          <div className="">
            <h5 className="text-lg font-semibold">{loginData.Header[1]}</h5>
            <p>{loginData.SubHeader[1]}</p>
          </div>
          <div className="">
            <h5 className="text-lg font-semibold">{loginData.Header[2]}</h5>
            <p>{loginData.SubHeader[2]}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
        <><p className="h-[100px]"></p></>
          <div className="w-[500px] border rounded-xl px-10 py-10 pb-14 text-center">
            <header className="mb-5">
              <h3 className="text-lg font-semibold">Create your account</h3>
              <p className="text-sm text-gray-400">
                Welcome! Please fill in the details to get started.
              </p>
            </header>

            <form action="post">
              <div className="">
                <p className="text-sm text-gray-500 mb-2 text-left">
                  Full Name
                </p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>setUsername(e.target.value)}
                  className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
                />
                <p className="text-sm text-gray-500 mb-2 text-left">
                  Email Address
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
                />
                <p className="text-sm text-gray-500 mb-2 text-left">Password</p>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
                />
              
              </div>
              <CustomButton text="Submit" onClick={handleClick} />
            </form>

            <footer>
              <hr className="my-5" />
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/" className="text-black">
                  Sign In
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import logo from "../../assets/image/logo.png";
import { AppContext } from "../../context/AppContext";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState(data || "");
  const { isTeacher, setIsTeacher, isAdmin } = useContext(AppContext);
  console.log(isTeacher);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    navigate("/");
  };

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  const becomeTeacher = async () => {
    try {
      if (isTeacher) {
        navigate("/teacher");
        return;
      }

      const { data } = await apiClient.put("/updateRole", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      console.log(data);
      if (data.success) {
        localStorage.setItem("role", "teacher");
        setIsTeacher(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 md:px-16">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="h-[40px]"
            onClick={() => navigate("/")}
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-row space-x-10 text-lg">
          <li>
            <Link className="text-black hover:text-blue-600" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-black hover:text-blue-600" to="/mentor">
              Mentors
            </Link>
          </li>
          <li>
            <Link className="text-black hover:text-blue-600" to="/course-list">
              Courses
            </Link>
          </li>
          <li>
            <Link className="text-black hover:text-blue-600" to="/about-us">
              About Us
            </Link>
          </li>
        </ul>

        {/* Search Bar & User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={onSearchHandler} className="relative flex">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Search courses..."
              className="w-64 border border-gray-300 rounded-full px-4 py-2 pl-10 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
<button
  className="text-gray-500 hover:text-blue-600"
  onClick={() => {
    if (isAdmin) {
      navigate("/admin");
    } else if (isTeacher) {
      navigate("/teacher");
    } else {
      navigate("/teacherRequest");
    }
  }}
>
  {isAdmin
    ? "Admin Dashboard"
    : isTeacher
    ? "Teacher Dashboard"
    : "Become a Teacher"}
</button>

                <span className="text-gray-500">|</span>
                <Link
                  to="/my-enrollments"
                  className="text-gray-500 hover:text-blue-600"
                >
                  My Enrollments
                </Link>
              </>
            )}

            {/* Sign In / Sign Out Button */}
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth/signin")}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (Toggle) */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 space-y-4">
          <form
            onSubmit={onSearchHandler}
            className="relative flex w-full max-w-xs"
          >
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Search courses..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          <Link
            to="/"
            className="text-black hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/mentor"
            className="text-black hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Mentors
          </Link>
          <Link
            to="/course-list"
            className="text-black hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/about-us"
            className="text-black hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          {isLoggedIn && (
            <>
             <button
  className="text-gray-500 hover:text-blue-600"
  onClick={() => {
    if (isAdmin) {
      navigate("/admin");
    } else if (isTeacher) {
      navigate("/teacher");
    } else {
     
      navigate("/teacherRequest");
    }
  }}
>
  {isAdmin
    ? "Admin Dashboard"
    : isTeacher
    ? "Teacher Dashboard"
    : "Become a Teacher"}
</button>
<Link
  to="/my-enrollments"
  className="text-gray-500 hover:text-blue-600"
  onClick={() => setMenuOpen(false)}
>
  My Enrollments
</Link>

            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleSignOut();
                setMenuOpen(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/auth/signin");
                setMenuOpen(false);
              }}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

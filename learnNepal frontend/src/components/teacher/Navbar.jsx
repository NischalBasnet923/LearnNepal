import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import profile from "../../assets/image/profile.png";

const Navbar = () => {
  const userData = localStorage.getItem("userInfo");
  const user = JSON.parse(userData);
  console.log("sdfgv", user.imageUrl);
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={logo} alt="logo" className="w-16 lg:w-10" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user ? user.username : "Teachers"}</p>
        {user ? (
          user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="profile"
              className="max-w-8 rounded-full"
            />
          ) : (
            <img src={profile} alt="profile" className="max-w-8" />
          )
        ) : (
          <img src={profile} alt="profile" className="max-w-8" />
        )}
      </div>
    </div>
  );
};

export default Navbar;

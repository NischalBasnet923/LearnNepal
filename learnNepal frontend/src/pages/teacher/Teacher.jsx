import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/teacher/Navbar";
import Sidebar from "../../components/teacher/Sidebar";
import Footer from "../../components/teacher/Footer";

const Teacher = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        {" "}
        <Sidebar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Teacher;

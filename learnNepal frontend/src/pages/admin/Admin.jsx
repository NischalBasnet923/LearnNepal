import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/teacher/Navbar";
import Sidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/teacher/Footer";

const Admin = () => {
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

export default Admin;

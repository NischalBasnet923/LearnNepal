import React, { useContext } from "react";
import home from "../../assets/image/home_icon.svg";
import add from "../../assets/image/add_icon.svg";
import my_course from "../../assets/image/my_course_icon.svg";
import person_tick from "../../assets/image/person_tick_icon.svg";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isTeacher } = useContext(AppContext);

  const menuItems = [
    { name: "Dashboard", path: "/teacher", icons: home },
    { name: "Add Course", path: "/teacher/add-course", icons: add },
    { name: "My Course", path: "/teacher/my-courses", icons: my_course },
    {
      name: "Student Enrolled",
      path: "/teacher/student-enrolled",
      icons: person_tick,
    },
  ];

  return (
    isTeacher && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path == "/teacher"}
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
                isActive
                  ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                  : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
              }`
            }
          >
            <img src={item.icons} alt="" className="w-6 h-6" />
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;

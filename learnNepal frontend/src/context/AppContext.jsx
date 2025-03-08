import { createContext } from "react";
import { useState, useEffect } from "react";
import apiClient from "../api/axios.js";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const user = localStorage.getItem("userInfo");

  const [allCourses, setAllCourses] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await apiClient.get("/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  // function to calculate rating
  const calculateRating = (course) => {
    if (course.ratings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.ratings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.ratings.length);
  };

  // function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.lectures.map((lecture) => (time += lecture.duration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // function to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.chapters.map((chapter) =>
      chapter.lectures.map((lecture) => (time += lecture.duration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // function to calculate number of lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.chapters.forEach((chapter) => {
      if (Array.isArray(chapter.lectures)) {
        totalLectures += chapter.lectures.length;
      }
    });
    return totalLectures;
  };

  // Check if user is a teacher
  useEffect(() => {
    if (user) {
      const userInfo = JSON.parse(user);
      setIsTeacher(userInfo.role === "teacher");
      setIsAdmin(userInfo.role === "admin");
    }
  }, [user]);

  // fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const { data } = await apiClient.get("/user/enrolledCourses", {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(data);
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    calculateRating,
    isTeacher,
    setIsTeacher,
    isAdmin,
    setIsAdmin,
    enrolledCourses,
    fetchUserEnrolledCourses,
    fetchData,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

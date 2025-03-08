import React from "react";
import Hero from "../../components/student/Hero";
import CategorySection from "../../components/student/CategorySection";
import RecommendedCourses from "../../components/student/RecommendedCourses";
import BannerSection from "../../components/student/BannerSection";
import CourseSection from "../../components/student/CourseSection";
import TestimonialSection from "../../components/student/TestimonialSection";
import Footer from "../../components/student/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <CategorySection />
      <RecommendedCourses />
      <BannerSection />
      <CourseSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Home;

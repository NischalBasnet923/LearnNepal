import React from "react";
import { images } from "../../context";
import { useNavigate } from "react-router-dom";

const BannerSection = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-between bg-[#BFDCFF] mt-20">
      <div className="flex flex-row justify-between gap-20 items-center w-[70%] ml-20">
        {/* Left Section - Course Stats */}
        <div className="flex flex-row justify-between items-center gap-5">
          <div className="flex flex-col justify-between items-center gap-5">
            {/* Courses Box */}
            <div className="h-[210px] w-[260px] bg-[#FA764B] border rounded-lg flex flex-col items-center">
              <div className="flex flex-row items-start w-[244px] ml-10 mt-6">
                <img src={images.book} alt="book" className="w-[50px]" />
              </div>
              <p className="text-white font-semibold text-[70px] leading-none">
                15
              </p>
              <p className="text-white font-semibold text-[23px] mt-1">
                Courses
              </p>
            </div>

            {/* Categories Box */}
            <div className="h-[210px] w-[260px] bg-[#5C9F77] border rounded-lg flex flex-col items-center">
              <div className="flex flex-row items-start w-[244px] ml-10 mt-6">
                <img
                  src={images.cat}
                  alt="category"
                  className="w-[40px] h-[40px]"
                />
              </div>
              <p className="text-white font-semibold text-[70px] leading-none">
                8
              </p>
              <p className="text-white font-semibold text-[23px] mt-1">
                Categories
              </p>
            </div>
          </div>

          {/* Graduate Students Box */}
          <div className="flex flex-col items-center h-[438px] w-[227px] bg-[#2A5D8F] rounded-lg">
            <div className="flex flex-row items-start w-[324px] ml-32 mt-14 mb-10">
              <img src={images.grad} alt="hat" className="h-[70px]" />
            </div>
            <p className="text-white font-semibold text-[70px] leading-none mb-5">
              200+
            </p>
            <p className="text-white font-semibold text-[23px] mt-1">
              Graduate Students
            </p>
          </div>
        </div>

        {/* Right Section - Course Info */}
        <div>
          <p className="text-[50px] leading-tight font-semibold w-[331px]">
            Our Course Status
          </p>
          <p className="w-[416px] text-[15px] text-[#484848]">
            Check out the current state of our classes. Select your course, give
            us your time, and we'll work with you to fit you into the
            appropriate timetable.
          </p>

          {/* Course Features */}
          <div className="mt-4">
            <p className="text-[#484848] text-[16px] py-2 px-1">
              <span className="text-green-400">✓</span> Affordable Learning
            </p>
            <p className="text-[#484848] text-[16px] py-2 px-1">
              <span className="text-green-400">✓</span> Certificates
            </p>
            <p className="text-[#484848] text-[16px] py-2 px-1">
              <span className="text-green-400">✓</span> Daily Recorded Classes
            </p>
          </div>

          {/* Explore Courses Button */}
          <button
            className="bg-[#5EA7FF] text-white text-bold text-[16px] font-medium px-9 py-3 border rounded-full mt-12"
            onClick={() => navigate("/course/list")}
          >
            Explore Courses
          </button>
        </div>
      </div>

      {/* Background Vector Image */}
      <img src={images.vector} alt="vector" className="h-[618px]" />
    </div>
  );
};

export default BannerSection;

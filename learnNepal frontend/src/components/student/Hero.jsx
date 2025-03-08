import React from "react";
import learn from "../../assets/image/learn.png";

const Hero = () => {
  return (
    <div className="flex flex-col h-[90vh] px-6 md:px-16 py-16 bg-gradient-to-l from-blue-200 to-white">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start h-auto md:h-[100%]">
        {/* Text Section */}
        <div className="text-center md:text-left md:mt-20">
          <p className="text-2xl md:text-5xl font-bold pb-1 mb-4 leading-snug">
            "Learn Anytime, Achieve Anywhere
            <br />
            Your Path to Success
            <span className="text-blue-400"> Starts Here!</span>"
          </p>
          <p className="text-sm md:text-lg mb-6 text-gray-600">
            Master new skills and transform your future with top-notch courses.
          </p>
          <button className="bg-black text-white font-medium px-6 py-3 md:px-8 md:py-4 text-lg rounded-full transition hover:bg-blue-600">
            Explore More
          </button>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end w-full mt-10 md:mt-0">
          <img
            src={learn}
            alt="Learn"
            className="w-full max-w-[920px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

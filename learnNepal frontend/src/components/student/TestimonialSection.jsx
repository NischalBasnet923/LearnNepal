import React from "react";
import { dummyTestimonialData } from "../../assets/assets";

const TestimonialSection = () => {
  return (
    <div className="flex flex-col h-auto px-6 md:px-16 py-16 items-center">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800">Testimonials</h2>
        <p className="text-gray-500 text-lg mt-3">
          Hear from our learners as they share their journeys of transformation,
          success, and how our platform has made a difference in their lives.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14 w-full max-w-6xl">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg bg-white shadow-md pb-7"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="p-5 pb-7">
              <div className="flex gap-1 mt-3 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <p key={i}>{i < testimonial.rating ? "⭐" : "☆"}</p>
                ))}
              </div>

              {/* Testimonial Feedback */}
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;

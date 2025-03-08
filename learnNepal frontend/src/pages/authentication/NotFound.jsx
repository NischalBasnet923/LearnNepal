import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleGoHome = () => {
    navigate("/home"); // Navigate to the homepage
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-9xl font-extrabold text-red-500">404</h1>
      <p className="text-2xl text-gray-700 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-gray-700 text-white text-lg font-medium rounded-md hover:bg-gray-600 transition"
        >
          Go Back
        </button>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-blue-500 text-white text-lg font-medium rounded-md hover:bg-blue-600 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

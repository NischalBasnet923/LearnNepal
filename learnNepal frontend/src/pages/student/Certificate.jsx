import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Certificate = () => {
  const location = useLocation();
  const certificateData = location.state || {
    studentName: 'John Doe',
    courseName: 'Advanced Web Development',
    completionDate: 'April 15, 2025',
    certificateId: 'LNPL-8472913',
    instructorName: 'Dr. Sarah Johnson',
    hoursCompleted: '40',
    grade: 'Excellence',
  };

  // Function to generate PDF (in a real app, you would use a library like jsPDF)
  const generateCertificate = () => {
    // In a real implementation, this would generate and download a PDF
    alert(
      `Certificate for ${certificateData.studentName} would be downloaded!`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          Course Completion Certificate
        </h1>
        <p className="text-gray-600">
          Download your official LearnNepal certificate
        </p>
      </div>

      {/* Certificate Preview */}
      <div className="mb-8 relative">
        {/* Certificate Border Elements */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-xl opacity-75 blur-sm"></div>

        <div className="relative bg-white p-10 border-8 border-double border-blue-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern
                  id="pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse">
                  <path d="M0 0 L20 0 L20 20 L0 20 Z" fill="#4338ca" />
                </pattern>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#pattern)"
              />
            </svg>
          </div>

          {/* Top Corner Decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-blue-800 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-blue-800 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-blue-800 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-blue-800 rounded-br-lg"></div>

          {/* Certificate Header */}
          <div className="relative mb-10 text-center">
            {/* Logo */}
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-800 text-white font-bold text-xl px-4 py-2 rounded">
                LearnNepal
              </div>
            </div>

            <h2 className="text-3xl font-bold text-blue-800 mb-1">
              CERTIFICATE OF ACHIEVEMENT
            </h2>
            <p className="text-lg text-blue-600 italic">
              Excellence in Online Education
            </p>
            <div className="w-full max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-4"></div>
          </div>

          {/* Certificate Content */}
          <div className="text-center mb-10 relative z-10">
            <p className="text-gray-700 mb-2">This is to certify that</p>
            <p className="text-4xl font-serif font-bold text-blue-900 mb-4 border-b border-gray-200 pb-2 px-8 mx-auto inline-block">
              {certificateData.studentName}
            </p>
            <p className="text-gray-700 mb-4">
              has successfully completed the course
            </p>
            <p className="text-2xl font-semibold text-blue-900 mb-4 px-4 py-2 border-2 border-blue-200 rounded-lg mx-auto inline-block bg-blue-50">
              {certificateData.courseName}
            </p>
            <p className="text-gray-700 mt-4">
              with{' '}
              <span className="font-semibold">{certificateData.grade}</span>{' '}
              grade and
              <span className="font-semibold">
                {' '}
                {certificateData.hoursCompleted} hours
              </span>{' '}
              of coursework
            </p>
            <p className="text-gray-700 mt-2">
              on {certificateData.completionDate}
            </p>

            {/* Decorative Element */}
            <div className="w-24 h-1 bg-blue-500 mx-auto my-6"></div>
          </div>

          {/* Certificate Footer */}
          <div className="flex justify-center items-end relative z-10">
            <div className="text-center">
              <div className="w-56 h-px bg-gray-400 mb-1"></div>
              <p className="text-gray-800 font-medium">
                {certificateData.instructorName}
              </p>
              <p className="text-sm text-gray-600">Course Instructor</p>
            </div>
          </div>

          {/* Certificate Seal */}
          <div className="absolute -right-6 bottom-10 w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-4 border-white shadow-xl transform rotate-12">
            <div className="text-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-300 opacity-50"></div>
              <div className="text-xs">VERIFIED BY</div>
              <div className="text-lg font-bold">LearnNepal</div>
              <div className="text-xs mt-1">AUTHENTIC</div>
            </div>
          </div>

          {/* Verification Info */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-500">
            <p>Certificate ID: {certificateData.certificateId}</p>
            <p>Verify at: verify.learnnepal.com</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={generateCertificate}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-xl transition duration-200 text-lg">
          <Download className="w-6 h-6 mr-2" />
          Download Official Certificate
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="font-medium">About LearnNepal Certificates</p>
        <p className="mt-1">
          All certificates include a unique ID and can be verified through our
          online system.
        </p>
        <p className="mt-1">
          Our certificates are recognized by leading employers across Nepal and
          internationally.
        </p>
      </div>
    </div>
  );
};

export default Certificate;

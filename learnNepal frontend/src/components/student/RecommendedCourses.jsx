import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import apiClient from '../../api/axios';

const RecommendedCourses = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const response = await apiClient.get('/ai/recommand', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.warn(response);
        const data = await response.data;
        if (data.recommendedCourses) {
          setRecommendedCourses(data.recommendedCourses);
        }
      } catch (error) {
        console.error('Failed to fetch recommended courses:', error);
      }
    };

    fetchRecommendedCourses();
  }, []);

  return (
    <div className="flex flex-col h-auto px-6 md:px-16 py-16">
      <p className="text-2xl font-semibold mt-6">Recommended Courses</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
        {recommendedCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;

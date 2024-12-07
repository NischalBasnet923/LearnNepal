import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      toast.success("Logout successfully");
      navigate('/'); // Navigate to the signin page
    } catch (error) {
      console.log("Logout Failed", error);
      toast.error("Logout failed, please try again.");
    }
  };

  return (
    <div>
      <p>Home</p>
      <button onClick={handleLogout}>LogOut</button>
    </div>
  );
};

export default Home;

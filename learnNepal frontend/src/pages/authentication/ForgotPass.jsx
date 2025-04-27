import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/basic components/button';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async () => {
    // Validate email
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/requestotp', { email });

      if (data.message === 'OTP sent to email') {
        toast.success('OTP sent to your email');
        // Store email in sessionStorage to use it in the OTP verification page
        sessionStorage.setItem('resetEmail', email);
        navigate('/auth/otp');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    sendRequest();
  };

  return (
    <div className="w-[560px] justify-center mx-auto bg-white rounded-xl shadow-md text-center px-7 pt-11 pb-20 self-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/auth/signin')}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold">
          ×
        </button>
      </div>
      <h1 className="text-2xl font-semibold mb-5">Forgot Password?</h1>
      <p className="text-sm text-gray-500 mb-5">
        Enter your email address below and we will send you a verification code
        to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-10">
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2 text-left">Email</p>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[55px] p-2 border border-gray-300 rounded-md mb-5"
            required
          />
        </div>
        <CustomButton
          text={isLoading ? 'Sending...' : 'Send Verification Code'}
          type="submit"
          disabled={isLoading}
          bgColor="bg-black"
          textColor="text-white"
          className="w-full"
        />
      </form>
    </div>
  );
};

export default ForgotPass;

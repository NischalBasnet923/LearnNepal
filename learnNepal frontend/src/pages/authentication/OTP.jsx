import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/basic components/button';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react'; // Add this import if you're using lucide-react

const OTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']); // Array for 4 digits
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const email = sessionStorage.getItem('resetEmail');

  // Focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    if (!email) {
      toast.error('Email not found. Please try again.');
      navigate('/auth/forgot-password');
    }
  }, [navigate, email]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format the timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      toast.error('Please enter all 4 digits of the OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/verifyotp', {
        email,
        otp: otpValue,
      });

      if (response.data.message === 'OTP verified') {
        toast.success('OTP verified successfully');
        // Store verification status in session to ensure user followed the proper flow
        sessionStorage.setItem('otpVerified', 'true');
        navigate('/auth/change-password');
      } else {
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // const errorMessage = error.response?.data?.message || error.message || "Failed to verify OTP";
      toast.error('OTP didnt match');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;

    setIsResending(true);

    try {
      const response = await apiClient.post('/requestotp', { email });

      if (response.data.message === 'OTP sent to email') {
        toast.success('New OTP sent to your email');
        setTimer(30); // Reset timer
        setOtp(['', '', '', '']);
        // Focus the first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to resend OTP';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp();
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl rounded-xl">
      <div className="w-[500px] rounded-2xl px-10 py-10 pb-14 text-center border border-gray-100 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/auth/forgot-password')}
            className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back</span>
          </button>
          <button
            onClick={() => navigate('/auth/signin')}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>
        <h1 className="text-2xl font-medium mb-3">Enter OTP</h1>
        <p className="text-[12px] text-gray-500">
          We have sent a verification code to your email{' '}
          {email && <span className="font-medium">{email}</span>}. Please enter
          the 4-digit code below to verify your identity.
        </p>
        <form onSubmit={handleSubmit} className="px-7">
          <div className="flex gap-6 drop-shadow-md mb-8 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[52px] h-[52px] border border-gray-300 rounded-md text-center text-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                disabled={isLoading}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mb-8">
            <p>Didnt receive code?</p>
            <button
              type="button"
              onClick={resendOtp}
              disabled={timer > 0 || isResending}
              className={`mt-1 ${
                timer > 0 || isResending
                  ? 'text-gray-400'
                  : 'text-blue-500 hover:text-blue-700'
              }`}>
              {isResending
                ? 'Sending...'
                : timer > 0
                ? `Request again (${formatTime(timer)})`
                : 'Request again'}
            </button>
          </div>
          <CustomButton
            text={isLoading ? 'Verifying...' : 'Verify & Continue'}
            type="submit"
            disabled={isLoading || otp.some((digit) => !digit)}
            bgColor="bg-black"
            textColor="text-white"
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default OTP;

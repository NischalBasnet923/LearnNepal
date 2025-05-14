import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/basic components/button';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, X } from 'lucide-react'; // Add this import if you're using lucide-react

const PassChange = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  });

  const email = sessionStorage.getItem('resetEmail');
  const isOtpVerified = sessionStorage.getItem('otpVerified') === 'true';

  // Check if user has gone through the proper flow
  useEffect(() => {
    if (!email || !isOtpVerified) {
      toast.error('Please verify your OTP first');
      navigate('/auth/forgot-password');
    }
  }, [email, isOtpVerified, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength on input change
    if (name === 'password') {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    // Check if password is at least 8 characters
    const isLengthValid = password.length >= 8;
    // Check if password has at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    // Check if password has at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);
    // Check if password has at least one number
    const hasNumber = /\d/.test(password);
    // Check if password has at least one special character
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid =
      isLengthValid &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar;

    let message = '';
    if (!isLengthValid) {
      message = 'Password must be at least 8 characters';
    } else if (!hasUppercase) {
      message = 'Password must include an uppercase letter';
    } else if (!hasLowercase) {
      message = 'Password must include a lowercase letter';
    } else if (!hasNumber) {
      message = 'Password must include a number';
    } else if (!hasSpecialChar) {
      message = 'Password must include a special character';
    }

    setPasswordStrength({ isValid, message });
  };

  const resetPassword = async () => {
    // Validate password strength
    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message || 'Password is not strong enough');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/resetpassword', {
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.message === 'Password reset successful') {
        toast.success('Password reset successful');
        navigate('/auth/signin');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl rounded-xl">
      <div className="w-[500px] rounded-2xl px-10 py-10 pb-14 text-center border border-gray-100 flex flex-col gap-1">
        <div className="self-end">
          <button
            onClick={() => navigate('/auth/login')}
            className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <h1 className="text-[24px] font-medium">Change Password</h1>
        <p className="text-[12px] text-gray-500">
          Create a new strong password for your account. Your password should
          include at least 8 characters with uppercase, lowercase, numbers, and
          special characters.
        </p>
        <form onSubmit={handleSubmit} className="px-7 mt-6">
          <div className="mb-5">
            <p className="text-[14px] text-gray-500 text-left mb-1">Password</p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full h-[45px] p-2 pr-10 border border-gray-300 rounded-md"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && passwordStrength.message && (
              <p
                className={`text-xs mt-1 text-left ${
                  passwordStrength.isValid ? 'text-green-500' : 'text-red-500'
                }`}>
                {passwordStrength.message}
              </p>
            )}
          </div>

          <div className="mb-8">
            <p className="text-[14px] text-gray-500 text-left mb-1">
              Confirm Password
            </p>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full h-[45px] p-2 pr-10 border border-gray-300 rounded-md"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs mt-1 text-left text-red-500">
                  Passwords do not match
                </p>
              )}
          </div>

          <CustomButton
            text={isLoading ? 'Updating Password...' : 'Change Password'}
            type="submit"
            disabled={
              isLoading ||
              !formData.password ||
              !formData.confirmPassword ||
              !passwordStrength.isValid ||
              formData.password !== formData.confirmPassword
            }
            bgColor="bg-black"
            textColor="text-white"
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default PassChange;

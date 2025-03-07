import React, { useState } from 'react'
import registerLogo from '../../assets/login_enhanced.png'
import logo from '../../assets/BookWala.png'
import { setError, setLoading } from '../../store/slice/userSlice'
import { validateLogin } from '../../utils/ValidateRegister'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Forgottpasswod from './Forgottpasswod'

const Login = () => {
    const { login ,forgotPassword , verifyOTP } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [forgetpassword, setforgetPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error: {
    email?: string;
    password?: string;
  } = useSelector((state: RootState) => state.user.error)?? {}
  const loading = useSelector((state : RootState)=> state.user.loading) 
  
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForgetPassword = async (email: string) => {
    if (!email) {
        toast.error("Please enter your email first.");
        return;
    }

    const response = await forgotPassword(email);

    if (response.success) {
        setOtpSent(true);
    } else {
        toast.error('Error in forgetPassword set..')
    }
};
    const handleVerifyOtp = async (otp: string, email: string) => {
    if (!otp || otp.length != 4) {
        toast.error("Please Enter valid OTP");
        return null;
      }

    const response = await verifyOTP(email,otp);

    if (response.success) {
        setOtpSent(true);
    } else {
        toast.error('Error in forgetPassword set..')
    }
};
    
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     
    const formDataError = validateLogin({ email: formData.email, password: formData.password });
    if (formDataError) {
      setTimeout(() => {
        dispatch(setLoading(false));
        dispatch(setError(formDataError));
        toast.error("Please correct the highlighted errors.");
      }, 1000);
      return;
    } else {
      dispatch(setError({}));

      try {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate("/");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Unexpected login error:", error);
        toast.error("An unexpected error occurred.");
      }
    };
    }
    
    const handleCancelation = () => {
    setforgetPassword(false);
    dispatch(setLoading(false));
    setResetPassword(false);
  };
  return (
    <>
        {forgetpassword && (
          <Forgottpasswod
            onVerify={handleVerifyOtp}
            conform={handleForgetPassword}
            onCancel={handleCancelation}
            message="Enter your email"
            title="Forgot Password"
          />
        )}
   
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side gradient - full height on mobile */}
      {/* Left side gradient - minimal height on mobile, just for logo */}
      <div className="bg-gradient-to-tr from-[#72A9C3] to-[#D3E7E7] w-full md:w-[790px] h-24 md:h-auto flex flex-col justify-between p-2 md:p-6 text-white">
        {/* Logo positioned prominently on top left for mobile */}
        <div className="logo self-start -ml-[21px] -mt-[60px] md:mt-[-39px]">
          <img
            src={logo}
            alt="Book Wala"
            className="h-[200px] w-[200px] md:h-[220px] md:w-[220px]"
          />
        </div>

        {/* Only show these elements on medium screens and up */}
        <div className="hidden md:block text-center -md:mt-[23px] mb-2.5">
          <h1 className="text-2xl md:text-[46px] font-[Prociono] text-[#525252] mb-2">
            Welcome Back{" "}
          </h1>
          <h3 className="text-lg md:text-[20px] md:pl-[200px] text-[#281c1c] opacity-90 font-[Roboto]">
            Unlock the smart ways of booking
          </h3>
        </div>

        {/* Only show image on medium screens and up */}
        <div className="hidden md:block bottomimage mb-4 mt-auto md:mt-8 lg:mt-1 w-full mx-auto md:self-start md:pl-8 lg:pl-0">
          <img
            src={registerLogo}
            alt="Registration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[430px] lg:ml-0 mx-auto md:mx-0"
          />
        </div>
      </div>

      {/* Right side content - premium look */}
      <div className="bg-white w-full md:w-2/3 flex items-center justify-center p-8 md:rounded-l-3xl shadow-lg md:-ml-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-16 text-[#525252] font-[Poppins]">
            Login
          </h1>

          <form className="space-y-12" onCanPlay={handleSubmit}>
            {/* Name field with floating label */}

            {/* Email field with floating label */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-blue-600 transition-colors focus:outline-none peer bg-inherit"
                placeholder=" "
              />
              {error?.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
              <label
                htmlFor="email"
                className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
              >
                Email
              </label>
            </div>

            {/* Password field with floating label */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-blue-600 transition-colors focus:outline-none peer bg-inherit pr-10"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-2 text-gray-500 cursor-text peer-focus:-top-4 transition-all peer-focus:text-blue-600 
                // This is the crucial change - add peer-not-placeholder-shown to keep label up when there's text
                peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-blue-600
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:text-sm font-[Poppins]"
              >
                Password
              </label>
              {/* Eye Icon for Toggle */}
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-600 transition"
                onClick={() => setShowPassword(!showPassword)}
                // Prevent the input from losing focus when clicking the button
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {error?.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full bg-[#8BB2B2] text-white py-3 px-4 rounded-lg hover:bg-[#78a4a4] transition duration-200 font-medium text-lg shadow-md"
              >
                Login to my account
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="w-full border-t border-gray-400" />
            <span className="mx-4 text-gray-500">OR</span>
            <hr className="w-full border-t border-gray-400" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <button className="border w-full text-black flex gap-2 items-center justify-center rounded-[9px] bg-white px-4 py-3  font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
              <svg
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6"
              >
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#FFC107"
                ></path>
                <path
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  fill="#FF3D00"
                ></path>
                <path
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  fill="#4CAF50"
                ></path>
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#1976D2"
                ></path>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-start" onClick={() => setforgetPassword(true)}>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* New User Registration */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New to BookWala?{" "}
              <Link to='/register' className="text-blue-600 font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Organization Registration */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Are you an Organization?{" "}
              <a href="#" className="text-[#8BB2B2] font-medium">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
     </>
  );
}

export default Login

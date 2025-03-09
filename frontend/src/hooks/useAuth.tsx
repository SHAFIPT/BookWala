import { loginUser, registerUser, resetPassword, sendPasswordResetOTP, sendRegistrationOTP, userLogout, verifyRegistrationOTP } from '../services/auth.service';
import { resetUser, setFormData, setIsUserAuthenticated ,setLoading,setUser } from '../store/slice/userSlice';
import { persistor } from '../store/store';
import axios from 'axios';
import  { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuth = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>('');
    const [tempUserData, setTempUserData] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const role = 'user'
    
    const login = async (email : string, password : string) => {
        try {
            const response = await loginUser(email, password ,role)
            console.log('Thsi is the response login ;;;;;',response)
            if (response.status === 200) {
                console.log('Thsi is  the rejpsonfe ;: ',response)
            const { user, accessToken, message } = response.data;

            localStorage.setItem("token", accessToken);
            dispatch(setIsUserAuthenticated(true));
            dispatch(setUser(user));

            toast.success(message);
            return { success: true };
        } else {
            toast.error("Login failed. Please try again.");
            return { success: false };
        }
        } catch (error) {
            console.error(error)
            return { success: false, error: 'Login failed' };
        }
    }

    const sendOTP = async (email: string, name: string, password :string ) => {
        try {
            console.log('Thsi is the emial to send ;;;00',email)
            const response = await sendRegistrationOTP(email)
            if (response.status == 200) {
                setIsOtpSent(true)
                setTempUserData({ email, name, password });
                return { success: true };
            }
            return { success: false, error: 'Failed to send OTP' };
        } catch (error) {
           console.error(error)
            return { success: false, error: 'Failed to send OTP' }; 
        }
    }

    const verifyOTP = async (email: string | null, otp: string) => {
        
        try {
           
        const finalEmail = email || tempUserData.email;
        if (!finalEmail) {
            return { success: false, error: "Email is required" };
        }
        
        console.log('Ths  is the emial going to send ok::',finalEmail)
        console.log('Ths  is the OTP going to send ok::',otp)
            const response = await verifyRegistrationOTP(finalEmail, otp);
            console.log('Thsi sit erepsonfse data ;;;;',response)
        if (response?.status === 200) {
            setOtpVerified(true);
            setIsOtpSent(false);
            return { success: true }; 
        } else {
            return { success: false, error: "Invalid OTP response" }; 
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Extract backend error message
            const errorMessage = error.response?.data?.message || "OTP verification failed";
            console.error("OTP Error:", errorMessage);
            return { success: false, error: errorMessage };
        }
        return { success: false, error: "An unexpected error occurred" };
    }
};

     const forgotPassword = async (email: string) => {
         try {
             console.log('Thsi si teh aut to send emial ::',email)
             const response = await sendPasswordResetOTP(email);
             console.log('This is the forget password response ::: ',response)
            if (response.status === 200) {
                setResetPasswordEmail(email);
                return { success: true };
            }
            return { 
                success: false, 
                error: 'Failed to send password reset OTP' 
            };
        } catch (error) {
            console.error(error);
            return { 
                success: false, 
                error: 'Failed to initiate password reset' 
            };
        }
    };

     const resetUserPassword = async (newPassword: string) => {
        try {
            if (!otpVerified || !resetPasswordEmail) {
                return { 
                    success: false, 
                    error: 'Please verify OTP first' 
                };
            }

            console.log('Thsi is the resetPasswod Email :: ot pass to backend ;:',resetPasswordEmail)
            console.log('this is th paswod to send new paasowd:::::',newPassword)
            const response = await resetPassword(resetPasswordEmail, newPassword);
            
            if (response.status === 200) {
                // Clear states after successful password reset
                setIsOtpSent(false);
                setOtpVerified(false);
                setResetPasswordEmail('');
                return { success: true };
            }
            return { 
                success: false, 
                error: 'Password reset failed' 
            };
        } catch (error) {
            console.error(error);
            return { 
                success: false, 
                error: 'Password reset failed' 
            };
        }
    };

const register = async (isOTPVerified = false) => {
    try {
        if (!isOTPVerified || !tempUserData.email) {
            return { success: false, error: 'Please verify OTP first' };
        }
        if (!tempUserData.name || !tempUserData.password ) {
            return { success: false, error: 'Name or password is missing ' };
        }

        dispatch(setLoading(true));

        console.log('Temp user data sending to backend:', tempUserData);

        const response = await registerUser(
            tempUserData.email,
            tempUserData.name,
            tempUserData.password,
            role
        );

        if (response.status === 200) {
            const { user, accessToken } = response.data.data;
            console.log('Registration successful:', response);

            localStorage.setItem('token', accessToken);

            dispatch(setUser(user));
            dispatch(setFormData(user));
            dispatch(setIsUserAuthenticated(true));

            setTempUserData({});
            setOtpVerified(false);
            setIsOtpSent(false);

            toast.success('User registered successfully');
            navigate('/');

            return { success: true };
        }

        return { success: false, error: 'Registration failed' };
    } catch (error) {
        console.error('Registration error:', error);

        let errorMessage = 'Registration failed';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message;
        }

        setTempUserData({});
        setOtpVerified(false);
        setIsOtpSent(false);

        return { success: false, error: errorMessage };
    } finally {
        dispatch(setLoading(false));
    }
};

    const logout = async () => {
        try {
            const response = await userLogout()
            if (response.status === 200) {
                dispatch(resetUser()); // Clear Redux state
                await persistor.purge(); // Clear persisted storage
                return { success: true };
            }
            return { success: false, error: 'Logout failed' };     
        } catch (error) {
            console.error(error);
            return { success: false, error: 'logout Faild' };
        }
    }

    const resetOTPStates = () => {
        setIsOtpSent(false);
        setOtpVerified(false);
        setTempUserData({});
    };

      return {
        login,
        sendOTP,
        verifyOTP,
        register,
        logout,
        resetOTPStates,
        isOtpSent,
        setIsOtpSent,
        otpVerified,
        forgotPassword,
        resetUserPassword
    };
}

export default useAuth

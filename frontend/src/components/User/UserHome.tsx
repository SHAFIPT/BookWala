import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { setLoading } from '../../store/slice/userSlice';
const UserHome = () => {
    const {logout }= useAuth()
    const user = useSelector((state: RootState) => state.user.user)
    const loading = useSelector((state: RootState) => state.user.loading)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleLogout = async () => {
    dispatch(setLoading(true))
     
    localStorage.removeItem('token');
    
    const response = await logout()
    
    if(response?.error){
        toast.error(response?.error)
        dispatch(setLoading(false))
    }
    toast.success('User logout succssuffly...')
    dispatch(setLoading(false))
    navigate('/login');
  };
    console.log('Thsi si the user::::',user)
  return (
    <>
      {loading && (
          <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.7)', // Optional: Adds a slight overlay
            zIndex: 9999
          }}>
            <div className="dot-spinner">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
          </div>
        )}
    
    <div className="relative min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {isMobile ? 'Home' : 'Welcome to Home Page'}
          </h1>
          {user && (
            <p className="text-sm text-gray-600">
              Hello, {user.name || 'User'}
            </p>
          )}
        </div>

        {/* Logout Button - Responsive */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center cursor-pointer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          {!isMobile && "Logout"}
        </button>
      </header>

      {/* Main content */}
      <main className="p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            You are successfully logged in. This is your personalized dashboard.
          </p>
          
          {/* User information display */}
          {user && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><span className="font-medium">Name:</span> {user.name || 'Not provided'}</p>
                <p><span className="font-medium">Email:</span> {user.email || 'Not provided'}</p>
                <p><span className="font-medium">Role:</span> {user.role || 'User'}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
};

export default UserHome;

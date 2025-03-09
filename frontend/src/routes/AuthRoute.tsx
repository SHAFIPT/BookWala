import {  Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


const AuthRoute = () => {
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);
  
  if (isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default AuthRoute
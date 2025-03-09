
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/login'
import Register from '../pages/Auth/register'
import UserHomePage from '../pages/Home/UserHomePage'
import AuthRoute from './AuthRoute'

const Rotues = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserHomePage />} />

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
      </Routes>
    </div>
  );
};

export default Rotues;

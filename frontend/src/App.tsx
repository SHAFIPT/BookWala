import './App.css';
import {  Route, Routes } from 'react-router-dom'; 
import Rotues from './routes/router';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground ">
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/*" element={<Rotues />} />
      </Routes>
    </div>
  );
}

export default App;
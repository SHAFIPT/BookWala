import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/login'
import Register from '../pages/Auth/register'

const Rotues = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default Rotues

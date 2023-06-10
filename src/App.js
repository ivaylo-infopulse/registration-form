import './App.css'
import React from 'react'
import {Login} from './components/login/Login'
import { Route, Routes } from 'react-router-dom'
import { Profile } from './components/profile/Profile'
import { Register } from './components/registration/Register'

function App() {

  return (
    <div className="App">
      <div className='app-wrapper'>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </div>
   </div>
  );
}

export default App;

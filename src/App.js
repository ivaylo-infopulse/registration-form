import './App.css';
import React from 'react';
import {Login} from './components/Login';
import { Route, Routes } from 'react-router-dom';
import { Profile } from './components/Profile';
import { Register } from './components/Register';

function App() {

  return (
    <div className="App">
      <div className='app-wrapper'>
    <h1>hello</h1>
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

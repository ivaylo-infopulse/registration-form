import './App.css'
import React from 'react'
import {Login} from './components/login/Login'
import { Route, Routes } from 'react-router-dom'
import { Profile } from './components/profile/Profile'
import { Register } from './components/registration/Register'
import ForgetPassword from './components/forgetPassword/ForgetPassword'
import ProductsList from './components/productsList/ProductsList'
import TheGame from './components/sudokuGame/TheGame'
import FinishOrder from './components/finishOrder/FinishOrder'

function App() {

  return (
    <div className="App">
      <div className='app-wrapper'>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/forgetPassword' element={<ForgetPassword/>}/>
          <Route path='/' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/products-list' element={<ProductsList/>}/>
          <Route path='/finish-order' element={<FinishOrder/>}/>
          <Route path='/sudoku-game' element={<TheGame/>}/>
        </Routes>
      </div>
   </div>
  );
}

export default App;

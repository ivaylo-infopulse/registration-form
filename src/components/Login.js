// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import '../styles/user.css'
import { useDispatch } from 'react-redux'
import { login } from '../features/user'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { userSchema } from '../validations/userValidation';
import { Link } from 'react-router-dom';

export const Login = () => {
  const arrData= JSON.parse(localStorage.getItem('userData'))
  const [user, setUser] = useState('');
  const [password, setPassword] = useState("");
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(userSchema)
  });
  
  const isProfileExist = arrData?.find(data => {
    return data.user===user && data.password===password
  })
 
  const onLogin=()=>{
    dispatch(login (isProfileExist))
    if(isProfileExist){
      buttonRef.current.click()
    }
  }
  
  const onSubmit= async (event)=>{
    event.preventDefault();
    let formData = {
      name: event.target[0].value,
      password: event.target[1].value,
    }
    await userSchema.isValid(formData)
    
    onLogin()
  }


  return (  
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <input 
          type="text" 
          placeholder='Enter username'
          {...register("name")} 
          value={user}
          onChange={(event)=>{setUser(event.target.value)}}  
        />
        <p className='errors'>{errors.name?.message}</p>

        <input 
          type="password"
          placeholder='Enter password'
          {...register("password")} 
          value={password}
          onChange={(event)=>{setPassword(event.target.value)}}
        />
        <p className='errors'>{errors.password?.message}</p>
        
        <button onClick={onLogin}>
        Login
        </button> 
        <br/>
        <Link className='link' to={'/register'} >Go to Registration</Link>
          <Link ref={buttonRef} className='linkLogIn' to={'/profile'} onClick={onLogin} style={{pointerEvents: isProfileExist ? '': 'none'}}/>
      </form>
    </div>
  
  )
}
// @ts-nocheck
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../features/user'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema } from '../../validations/userValidation'
import { Link } from 'react-router-dom'

export const arrData = JSON.parse(localStorage.getItem('userData') || '[]')

export const Login = () => {
  const buttonRef = useRef(null)
  const dispatch = useDispatch()
  
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(userSchema)
  })
  
  const generateUniqueRegistrationToken = () => {
    const token = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    return token;
  }

  const onSubmit = async(data)=>{
    const isProfileExist = arrData?.find(user => user.name === data.name)
    
    if (isProfileExist) {
      const registrationToken = generateUniqueRegistrationToken()
      localStorage.setItem('registrationToken', registrationToken)

      dispatch(login(isProfileExist))
      buttonRef.current.click()
    }
  }

  return (  
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <input 
          type='text'
          placeholder='Enter username'
          {...register('name')} 
        />
        <label>{errors.name?.message}</label>

        <input 
          type='password'
          placeholder='Enter password'
          {...register('password')} 
        />
        <label>{errors.password?.message}</label>
        
        <button type='submit'>Login</button> 
        <Link className='link'to={'/forgetPassword'}>Forgot password</Link>
        <Link className='link' to={'/register'} >Go to Registration</Link>
        <Link ref={buttonRef} to={'/profile'} />
      </form>
    </div>
  )
}
import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { registerUser } from '../../validations/userValidation'
import { Link } from 'react-router-dom'
import { arrData } from '../login/Login'
import './styles.css'


export const Register = () => {
  const [isAcc, setIsAcc] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(registerUser),
  })

  const onRegister = (registerData) => {  
    arrData.push(registerData)
    localStorage.setItem('userData', JSON.stringify(arrData))
  }

  const onSubmit = async (data) => {
    await registerUser.isValid(data)
    const isUserExist = arrData.find((user) => user.name === data.name)

    if (!isUserExist) {
      onRegister(data)
      setIsAcc(true)
    } else {
      setError('name', {
        type: 'manual',
        message: 'User already exist.',
      })
    } 
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='form'>
    {!isAcc ? 
      <>
        <h1>Registration page</h1>
        <input 
          type = 'text' 
          placeholder = 'Enter name' 
          {...register('name')} 
        />
        <label>{errors.name?.message}</label>
        
        <input 
          type = 'text' 
          placeholder = 'Enter email' 
          {...register('email')} 
        />
        <label>{errors.email?.message}</label>
        
        <input 
          type = 'text' 
          placeholder = 'Enter phone number' 
          {...register('phone')} 
        />
        <label>{errors.phone?.message}</label>

        <input 
          type = 'password' 
          placeholder = 'Enter password' 
          {...register('password')} 
        />
        <label>{errors.password?.message}</label>
        
        <input 
          type='password'
          placeholder='Confirm password' 
          {...register('confirmPassword')}
        />
        <label>{errors.confirmPassword?.message}</label>
        
        <button type='submit'>Register</button>
        <Link className='link' to={'/'}>Go to login</Link>
      </>
      :
      <>
        <h1>You have registered successfully</h1>
        <Link className='link' to={'/'}>Go to login</Link>
      </>
    }
    </form>
  )
}

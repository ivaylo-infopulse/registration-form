// @ts-nocheck
import React, { useState } from 'react'
import './styles.css'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { registerUser } from '../../validations/userValidation'
import { Link } from 'react-router-dom'

export let arrData

export const Register = () => {
  arrData = JSON.parse(localStorage.getItem('userData') || '[]')
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [isAcc, setIsAcc] = useState(false)
  
  const userData = {
    user,
    email,
    phone,
    password
  }

  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(registerUser)
  });
  
  const isUserExist = arrData.find(data => {
    return data.user === user
  })
  
  const onRegister = () => {
    if(!isUserExist){
      arrData.push(userData)
      localStorage.setItem('userData', JSON.stringify(arrData))
    }
  }

  const onSubmit = async (data, event)=>{
    event.preventDefault()
    let formData = {
      name: user,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword,
    }
    await registerUser.isValid(formData) 
    onRegister()
    
    if(data){ 
      setIsAcc(true) 
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
          onChange = {(event) => setUser(event.target.value)}
          />
        <label>{errors.name?.message}</label>
        
        <input 
          type = 'text' 
          placeholder = 'Enter email' 
          {...register('email')} 
          onChange = {(event) => setEmail(event.target.value)} 
        />
        <label>{errors.email?.message}</label>
        
        <input 
          type = 'text' 
          placeholder = 'Enter phone number' 
          {...register('phone')} 
          onChange = {(event) => setPhone(event.target.value)}
        />
        <label>{errors.phone?.message}</label>

        <input 
          type = 'password' 
          placeholder = 'Enter password' 
          {...register('password')} 
          onChange = {(event) => setPassword(event.target.value)}
        />
        <label>{errors.password?.message}</label>
        
        <input 
          type='password'
          placeholder='Confirm password' 
          {...register('confirmPassword')}
          onChange={(event)=> setConfirmPassword(event.target.value)} 
          />
        <label>{errors.confirmPassword?.message}</label>
        
        <button onClick={onSubmit}>Register</button>
        <br/>
        
        <Link className='link' to={'/'}>Go to login</Link>
      </>
      :
      <>
        <br/>

        <h1>You have registered successfully</h1>
        <Link className='link' to={'/'}>Go to login</Link>
        </>
    }
    </form>
  )
}

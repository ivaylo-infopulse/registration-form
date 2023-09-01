// @ts-nocheck
import React from 'react'
import { useState } from 'react'
import { forgetPassword } from '../../validations/userValidation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'


const ForgetPassword = () => {
  const arrData = JSON.parse(localStorage.getItem('userData'))
  const [isEmail, setIsEmail] = useState(false)
 
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(forgetPassword)
  })
 
  const onSubmit = (formData) => {
    const isProfileExist = arrData?.find(
      data => data.name === formData.name && data.email === formData.email
    )

    forgetPassword.isValid(formData)

    if(isProfileExist){
      setIsEmail(false)
      alert('To recover password please check email: ' + formData.email)
    }else{
      setIsEmail(true)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <input 
          type='text'
          placeholder='Enter username'
          {...register('name')} 
        />
        <label>{errors.name?.message}</label>

        <input 
          type = 'text' 
          placeholder = 'Enter email' 
          {...register('email')} 
        />
        {isEmail?
          <label>Wrong Email</label>
          :
          <label>{errors.email?.message}</label>
        }

        <button  type='submit'>Submit</button>
        <Link className='link' to={'/'}>Back to login</Link>
      </form>
  )
}

export default ForgetPassword

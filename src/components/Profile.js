// @ts-nocheck
import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { changeColor } from '../features/theme'
import { logout } from '../features/user'

import ChangeColor from './ChangeColor'

export const Profile = () => {

  const dispatch = useDispatch();
  const user = useSelector((state)=> state.user?.value)
  const themeColor = useSelector((state)=> state.theme.value)
  
  const onLogOut = ()=>{
    dispatch(changeColor("wheat"))
    dispatch(logout())
  }

  return (
    <div className='profile-page' style={{color: themeColor}}>
      <div className='profile-wrapper'>
        <h1>Profile page</h1>
        
        <p>Name: {user.user}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        
        <Link to={'/'} style={{ textDecoration: 'none'}}>
          <button onClick={onLogOut}>Logout</button>
        </Link>

        <ChangeColor/>
      </div>
    </div>
  )
}


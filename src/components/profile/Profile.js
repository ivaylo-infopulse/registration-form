// @ts-nocheck
import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { changeColor } from '../../features/theme'
import { logout } from '../../features/user'
import './styles.css'

import ChangeColor from '../chnageColor/ChangeColor'
import ListOfUsers from '../listOfUsers/ListOfUsers'
import { useState } from 'react'

export const Profile = () => {
  // debugger
  let existingData = JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch()
  const user = useSelector((state)=> state.user?.value)
  const themeColor = useSelector((state)=> state.theme.value)
  const [isList, setIsList] = useState(false)
  const [className, setClassName] = useState('initial-profile')
  let theIndex;
  
  existingData?.find((data, index) => {
    if(data.user === user.user){
      return theIndex = index
    }
  })
  const [selectedImage, setSelectedImage] = useState(existingData[theIndex]?.image);
  // debugger
  
  const onLogOut = ()=>{
    dispatch(changeColor('wheat'))
    dispatch(logout())
  }

  const showList=()=>{
    setIsList(!isList)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        if (existingData) {
          // Parse existing data as object
          if (!existingData[theIndex].image) {
            // If image property doesn't exist, add it
            existingData[theIndex].image = imageData;
          } else {
            // If image property exists, update its value
            existingData[theIndex].image = imageData;
          }
        }

        setSelectedImage(existingData[theIndex].image)
        localStorage.setItem('userData', JSON.stringify(existingData));
      };

      reader.readAsDataURL(file);
    }
  };

  // const handleDropdownClick = (e) => {
  //   // Handle dropdown item click event here
  // };

  const imageChange=()=>{
    document.getElementById('file-input').click();
  }


  return (
    <div className='profile-page' style={{color: themeColor}}>
      <div className='profile-content'>

        { selectedImage? 
          <div className='image-container'>
            <img className='image' src={selectedImage} alt="Avatar" /> 
            <div className="dropdown-menu">
              <ul>
                <li onClick={imageChange}>Change Photo</li>
                <li>Option</li>
              </ul>
            </div> 
          </div>
          : 
          <label onClick={imageChange}>
            Upload Image
          </label>
        }

        <button className='profileBtn' onClick={()=> className==='initial-profile' ? setClassName('profile-wrapper'): setClassName('initial-profile')}>
          <input id='file-input' style={{display: 'none', position: 'absolute', zIndex:'99999'}} type="file" accept="image/*" onChange={handleImageUpload} />
          <p>Profile Info</p>
        </button>

        <div className = {`test ${className}`}>
          <p>Name: {user.user}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>

          <Link className='log-out-link' to={'/'}>
            <button onClick={onLogOut}>Logout</button>
          </Link>

          <ChangeColor/>

        </div>
      </div>

      <button onClick={showList}>Show List Of Users</button>
      {isList ? <ListOfUsers/> : ''}
    </div>
  )
}


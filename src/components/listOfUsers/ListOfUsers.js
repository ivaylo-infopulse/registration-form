import React from 'react'
import './styles.css'

const ListOfUsers = () => {
  // @ts-ignore
  const arrData = JSON.parse(localStorage.getItem('userData'))
  
  return (
    <div className='users-list-wrapper'>
      <label>List of users:</label>
      <ol className='user-list'> 
        {arrData.map((item) => <li>{item.user}</li>)}
      </ol>
    </div>
  )
}

export default ListOfUsers

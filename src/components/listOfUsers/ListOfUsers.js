import React from 'react'
import './styles.css'

const parseTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const ListOfUsers = () => {
  const arrData = JSON.parse(localStorage.getItem('userData'))

  const sortedUsers = arrData.sort((a, b) =>
    parseTime(a.timeScore || '99:59:59') - parseTime(b.timeScore || '99:59:59')
  );
  
  return (
    <div className='users-list-wrapper'>
      <label>List of users and their best scores:</label>
      <ol className='user-list'> 
        {sortedUsers.map((item, index) => (
          <li key={index}>
            {item.name} - {item.timeScore || 'none'}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ListOfUsers

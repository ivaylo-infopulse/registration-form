// @ts-nocheck
import React, {useRef}from 'react'
import { useDispatch } from 'react-redux'
import { changeColor } from '../../features/theme'
import './styles.css'

const ChangeColor = () => {
  const dispatch = useDispatch()
  const inputRef = useRef()

  return (
    <div className='change-color'>
      <input  
        type = 'text'
        placeholder = 'Set another color'
        ref = {inputRef}
      />

      <button className='color-btn' onClick={()=> {
        dispatch(changeColor(inputRef.current.value))
        inputRef.current.focus()
        inputRef.current.value=''
        }}
      >
        change color
      </button>
    </div>
  )
}

export default ChangeColor

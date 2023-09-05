import { useState, useEffect } from 'react'
import { useDispatch} from 'react-redux'
import { timer } from '../../features/timer'


export const Timer = ({ isRunning }) => {
  const dispatch = useDispatch()
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  

  useEffect(() => {
    if (seconds === 60) {
      setSeconds(0)
      setMinutes(minutes => minutes + 1)
    }
    if (minutes === 60) {
      setMinutes(0)
      setHours(hours => hours + 1)
    }
  }, [seconds, minutes])

  
  const time = `${hours < 10 ? `0${hours}` 
  : hours}:${minutes < 10 ? `0${minutes}` 
  : minutes}:${seconds < 10 ? `0${seconds}` 
  : seconds}`

  useEffect(() => {
    if(isRunning){
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + 1)
        }, 1000);
      return () => clearInterval(interval)
    } else {
      dispatch(timer(time))
    }
  }, [isRunning, dispatch, time])
 
  
  return time
}

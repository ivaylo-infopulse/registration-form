import { createSlice } from "@reduxjs/toolkit"

const initialData = {
  user: '',
  email: '',
  phone: '',
  password: ''
}

export const userSlice = createSlice({
  
  name: 'user',
  initialState: {value: initialData},
  reducers: {
    login: (state, action) => {
      state.value = action.payload
       // console.log("Name on Login: "+state.value.user)
    },

    logout: (state)=>{
      state.value = initialData
      // console.log('Name on Logout: ' + state.value.user)
    },
  }
})

export const {login, logout} = userSlice.actions

export default userSlice.reducer
import * as yup from 'yup'
import { arrData } from '../components/login/Login'

export const registerUser = yup.object().shape({
  name: yup.string().min(3).required('Name is required'),
  email: yup.string().email().required("Enter a valid email"),
  phone: yup.string().required('Please enter Phone number')
  .matches(/^[0-9]{3,15}$/,'Phone number can contain only digits - not less then 3 and not bigger then 15.'),
  password: yup.string().required("This field is required"),
  confirmPassword: yup.string().required("This field is required")
  .oneOf([yup.ref('password'), null], 'Passwords must match'),
})


export const userSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3).test('is-true', `User does't match`, function (userValue) {
    return arrData.find(data => data.name===userValue)}),
  password: yup.string().required("This field is required").test('is-pass', 'Wrong password', function (passValue) {
    const user = arrData.find(data => data.name===this.parent.name)
    if (user) {
      return this.parent.name === user.name && passValue === user.password;
    }
    return false
  }),
})

export const forgetPassword = yup.object().shape({
  name: yup.string().required('Name is required').min(3).test('is-user', `User does't match`, function (value) {
    return arrData.find(data =>  data.name===value)}),
    email: yup.string().email().required("Enter a valid email").test('is-email', 'Wrong email', function (value) {
    return arrData.find(data => data.email===value)}),
})

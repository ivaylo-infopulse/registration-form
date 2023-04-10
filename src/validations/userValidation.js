import * as yup from 'yup'


let arrData= JSON.parse(localStorage.getItem('userData') || "[]")

export const registerUser = yup.object().shape({
  name: yup.string().min(3).test('is-true', 'User already exist', function (value) {
    return !arrData.find(data =>  data.user===value)}).required('Name is required'),
  email: yup.string().email().required("Enter a valid email"),
  phone: yup.string().required('Please enter Phone number')
  .matches(/^[0-9]{3,15}$/,'Phone number can contain only digits - not less then 3 and not bigger then 15.'),
  password: yup.string().required("This field is required"),
  confirmPassword: yup.string().required("This field is required")
  .oneOf([yup.ref('password'), null], 'Passwords must match'),
})


export const userSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3).test('is-user', `User does't exist`, function (value) {
    return arrData.find(data =>  data.user===value)}),
  password: yup.string().required("This field is required").test('is-pass', 'Wrong password', function (data) {
    return arrData.find(data => data.password===data)}),
})

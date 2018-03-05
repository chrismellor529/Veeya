export interface User {
  _id?: Number,
  userType: String,
  firstName: String,
  lastName: String,
  password: String,
  userName: String,
  email: String,
  phoneNumber: String,
  investor_id?: String,
  wholesaler_id?: String,
  properties?: Array<any>,
  minimumLoanAmount?: String,
  maximumLoanAmount?: String,
  connections?: Array<any>,
  terms?: Array<any>,
  profilePhoto?: String,
  user_id?: String
}
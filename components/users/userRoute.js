import express from 'express'
import verifyToken from '../../auth/jwt.js'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  userProfile,
  emailVerify,
  resetPassword,
  verifyResetToken,
  followerController,
  registerVendor,
  vendorLogin,
  verifyVendorLogin,
  vendorProfile,
  updatePassword
} from './userController.js'
import upload from '../../utils/upload.js'
const route = express.Router()



route.get('/allUsers', getAllUsers)
route.get('/profile', verifyToken, userProfile)
route.post('/register', upload.single('image'), createUser)
route.get('/:userId', getUserById)
route.put('/update/:userId', upload.single('image'), updateUser)
route.delete('/delete/:userId', verifyToken, deleteUser)
route.post('/login', login)
route.put('/verifyEmail', emailVerify)
route.put('/resetPassword', resetPassword)
route.put('/verifyPassword/:userId/:resetToken', verifyResetToken)
route.put('/followUnfollow/:userId', verifyToken, followerController)
route.put('/updatePassword', verifyToken, updatePassword)

// VENDOR ROUTES
route.post('/vendor/register', registerVendor)
route.post('/vendor/login', vendorLogin)
route.post('/vendor/login/2FA', verifyVendorLogin)
route.get('/vendor/profile',verifyToken, vendorProfile)

export default route

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
} from './userController.js'
import upload from '../../utils/upload.js'
const route = express.Router()



route.get('/allUsers', getAllUsers)
route.get('/profile', verifyToken, userProfile)
route.post('/register', upload.single('image'), createUser)
route.get('/:id', getUserById)
route.put('/edit/:id', upload.single('image'), updateUser)
route.delete('/delete/:id', deleteUser)
route.post('/login', login)
route.patch('/verify-email', emailVerify)

export default route

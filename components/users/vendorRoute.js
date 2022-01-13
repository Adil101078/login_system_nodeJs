import express from 'express'
import verifyToken from '../../auth/jwt.js'
import {
  registerVendor,
  vendorLogin,
  verifyVendorLogin,
  vendorProfile,
} from './userController.js'
const vendorRoute = express.Router()

vendorRoute.post('/register', registerVendor)
vendorRoute.post('/login', vendorLogin)
vendorRoute.post('/login/2FA', verifyVendorLogin)
vendorRoute.get('/profile',verifyToken, vendorProfile)

export default vendorRoute

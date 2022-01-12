import express from 'express'
import verifyToken from '../../auth/jwt.js'
import { 
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser,
    login,
    verifyLogin,
    updateUser,
    getUserById,
    acceptVendorApproval,
    rejectVendorApproval
} from './adminController.js'
const adminRoute = express.Router();

adminRoute.post('/login', login)
adminRoute.post('/verifyOtp', verifyLogin)
adminRoute.get('/allUsers', getAllUsers)
adminRoute.get('/user/:userId',verifyToken, getUserById)
adminRoute.delete('/user/:userId', verifyToken, deleteUser)
adminRoute.put('/user/disable', verifyToken, disableUser)
adminRoute.put('/user/:userId',verifyToken, updateUser)
adminRoute.put('/user/enable',verifyToken, enableUser)
adminRoute.put('/acceptVendor/:vendorId', verifyToken, acceptVendorApproval)
adminRoute.put('/rejectVendor/:vendorId', verifyToken, rejectVendorApproval)



export default adminRoute
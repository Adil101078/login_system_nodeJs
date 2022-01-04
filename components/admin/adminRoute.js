import express from 'express'
import { 
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser,
    login,
    verifyLogin,
    updateUser,
    getUserById
} from './adminController.js'
const adminRoute = express.Router();

adminRoute.get('/allUsers', getAllUsers)
adminRoute.patch('/user/disable', disableUser)
adminRoute.put('/user/:userId', updateUser)
adminRoute.put('/user/:userId', getUserById)
adminRoute.delete('/user/:userId', deleteUser)
adminRoute.patch('/user/enable', enableUser)
adminRoute.post('/login', login)
adminRoute.post('/verifyOtp', verifyLogin)



export default adminRoute
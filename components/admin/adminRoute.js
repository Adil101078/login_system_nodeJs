import express from 'express'
import { 
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser
} from './adminController.js'
const adminRoute = express.Router();

adminRoute.get('/allUsers', getAllUsers)
adminRoute.delete('/user/:userId', deleteUser)
adminRoute.patch('/user/disable', disableUser)
adminRoute.patch('/user/enable', enableUser)


export default adminRoute
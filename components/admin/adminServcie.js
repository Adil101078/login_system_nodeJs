import User from '../users/userModel.js'
import {ErrorHandler} from '../../helpers/globalHandler.js'
import logger from '../../middlewares/logger.js'
import mongoose from 'mongoose'

const getAllUsersService = async (next) => {
    logger.info('Inside getAllUsers adminService')
    try {
        const users = await User.aggregate([
            { $match: {}}
        ])
        if(!users){
        throw new ErrorHandler(404, 'No records found')
        }
        return users
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const fetchByIdService = async(userId, next) => {
    logger.info('Inside getUserById adminService')
    try {
        let id = mongoose.Types.ObjectId(userId)
        const user = await User.aggregate([
            { $match: { _id: id }}
        ])
        if(!user) throw new ErrorHandler(404, 'User not found')
        return user
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}

const deleteUserService = async (userId, next) => {
    logger.info('Inside deleteUser adminService')
    try{
        const user = await User.findByIdAndDelete(userId)
        if(!user){
            throw new ErrorHandler(404, 'No records found')
        }
        return user

    }catch(error) {
        logger.error(error.message)
        next(error)
    }
}

const updateUserService = async (userId, userObj, next) => {
    logger.info('Inside updateUser adminService')
    try {
        const findUser = await User.findByIdAndUpdate(userId, userObj, { new:true })
        if(!findUser)
        throw new ErrorHandler(404, 'User not found')
        return findUser
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}



export {
    getAllUsersService,
    deleteUserService,
    updateUserService,
    fetchByIdService
    
}
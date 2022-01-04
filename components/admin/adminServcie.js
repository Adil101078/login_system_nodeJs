import User from '../users/userModel.js'
import {ErrorHandler} from '../../helpers/globalHandler.js'
import logger from '../../middlewares/logger.js'

const getAllUsersService = async (next) => {
    logger.info('Inside getAllUsers adminService')
    try {
        const users = await User.find().lean()
        if(!users){
        throw new ErrorHandler(404, 'No records found')
        }
        return users
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const fetchByIdService = async(id, next) => {
    logger.info('Inside getUserById adminService')
    try {
        const user = await User.findById(id)
        if(!user) throw new ErrorHandler(404, 'User not found')
        return user
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const deleteUserService = async (id, next) => {
    logger.info('Inside deleteUser adminService')
    try{
        const user = await User.findOneAndRemove(id)
        if(!user){
            throw new ErrorHandler(404, 'No records found')
        }
        return user

    }catch(error) {
        logger.error(error)
        next(error)
    }
}

const disableUserService = async(next)=>{
    logger.info('Inside disableUser adminService')
    try{
        const user = await User.findOne({email})
        if(!user){
            throw new ErrorHandler(404, 'No records found')
        }
        user.status = 'inActive',
        user.isVerified = false
        await user.save()
        return user

    }catch(error) {
        logger.error(error)
        next(error)
    }
    
}

const updateUserService = async (id, userObj) => {
    logger.info('Inside updateUser adminService')
    try {
        const findUser = await User.findByIdAndUpdate(id, userObj, { new:true })
        if(!findUser)
        throw new ErrorHandler(404, 'User not found')
        return findUser
    } catch (error) {
        logger.error(error)
        throw new Error(error.message)
    }
}



export {
    getAllUsersService,
    disableUserService,
    deleteUserService,
    updateUserService,
    fetchByIdService
    
}
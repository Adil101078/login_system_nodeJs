import User from '../users/userModel.js'
import AppError from '../../utils/appError.js'
import logger from '../../middlewares/logger.js'

const getAllUsersService = async (next) => {
    logger.info('Inside getAllUsers Service')
    try {
        const users = await User.find()
    if(!users){
        return next(new AppError('No records found', 400))
    }
    return {data:users}
    } catch (error) {
        logger.error(error)
        return error
    }
}

const deleteUserService = async (id, next) => {
    logger.info('Inside deleteUser Service')
    try{
        const user = await User.findOneAndRemove(id)
        if(!user){
            return next(new AppError('No records found', 400))
        }
        return user

    }catch(error) {
        logger.error(error)
        return error
    }
}

const disableUserService = async()=>{
    logger.info('Inside disableUser Service')
    try{
        const user = await User.findOne({email})
        if(!user){
            return new AppError('No records found', 400)
        }
        user.status = 'inActive',
        user.isVerified = false
        await user.save()
        return user

    }catch(error) {
        logger.error(error)
        return error
    }
    
}



export {
    getAllUsersService,
    disableUserService,
    deleteUserService
    
}
import User from '../users/userModel.js'
import {ErrorHandler} from '../../helpers/globalHandler.js'
import logger from '../../middlewares/logger.js'

const getAllUsersService = async (next) => {
    logger.info('Inside getAllUsers Service')
    try {
        const users = await User.find()
        if(!users){
        throw new ErrorHandler(404, 'No records found')
        }
        return {data:users}
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const deleteUserService = async (id, next) => {
    logger.info('Inside deleteUser Service')
    try{
        const user = await User.findOneAndRemove(id)
        if(!user){
            throw new ErrorHandler(404, 'No records found')
        }
        return {data:user}

    }catch(error) {
        logger.error(error)
        next(error)
    }
}

const disableUserService = async(next)=>{
    logger.info('Inside disableUser Service')
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



export {
    getAllUsersService,
    disableUserService,
    deleteUserService
    
}
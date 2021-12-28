import {
    getAllUsersService,
    deleteUserService,
} from './adminServcie.js'
import User from '../users/userModel.js'
import logger from '../../middlewares/logger.js'
import { handler } from '../../helpers/responseHandler.js'


const getAllUsers = async (req, res, next) => {
    logger.info('Inside getAllUser adminControllers')
    try {
        const data = await getAllUsersService()
        return handler.handleResponse({ res, ...data })
    } catch (error) {
        return handler.handleError({ res, err, data: error })
    }


}


const deleteUser = async (req, res, next) => {
    logger.info('Inside deleteUser adminControllers')
    try {
        const user = await deleteUserService(req.params.id)
        return handler.handleResponse({ res, ...user })
    } catch (error) {
        return handler.handleError({ res, err, user: error })
    }
}

const disableUser = async (req, res, next) => {
    logger.info('Inside disable adminControllers')
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        user.status = 'inActive',
        user.isVerified = false
        await user.save()
        return handler.handleResponse({ res, ...user})
    } catch (error) {
        return handler.handleError({ res, err, user: error })
    }

}

const enableUser = async (req, res, next) => {
    logger.info('Inside enableUser adminControllers')
    try{
        const { email } = req.body
        const user = await User.findOne({ email })
        user.status = 'active',
        user.isVerified = true,
        user.emailToken = null
        await user.save()
        return handler.handleResponse({ res, ...user})
    }catch(error){
        return handler.handleError({ res, err, user: error })
    }
}

export {
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser
}
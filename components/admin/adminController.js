import User from '../users/userModel.js'
import logger from '../../middlewares/logger.js'
import { getAllUsersService, deleteUserService } from './adminServcie.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import {sendOtp, verifyOtp } from '../../utils/sendOtp.js'


const getAllUsers = async (req, res, next) => {
    logger.info('Inside getAllUser adminControllers')
    try {
        const data = await getAllUsersService()
        return handleResponse({ res, ...data })
    } catch (error) {
        logger.error(error)
        next(error)
    }


}


const deleteUser = async (req, res, next) => {
    logger.info('Inside deleteUser adminControllers')
    try {
        const user = await deleteUserService(req.params.id)
        return handleResponse({ res, ...user })
    } catch (error) {
        logger.error(error)
        next(error)
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
        return handleResponse({ res, ...user})
    } catch (error) {
        logger.error(error)
        next(error)
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
        return handleResponse({ res, ...user})
    }catch(error){
        logger.error(error)
        next(error)
    }
}

const login = async(req, res, next)=>{
    logger.info('Inside adminLogin Controller')
    try{
        const {email, password} = req.body
        if(!email || !password){
            throw new ErrorHandler (404, 'Please provide email and password');
        }
        const user = await User.findOne({email}).select('+password')
        if(user.role === 'user')
            throw new ErrorHandler (404, 'User must be an admin');
        if(!user || !(await user.verifyPassword(password, user.password))){
            throw new ErrorHandler (400, 'Incorrect email or password');
        }
       
        const phone = user.phoneNumber   
        sendOtp(phone)
        const token = user.generateJwt()
        return handleResponse({
            res,
            msg:'OTP sent to registered Mobile Number',
            data:{user, token} })

    }catch(error){
        logger.error(error)
        next(error)
    }
}
const verifyLogin = async (req, res, next) => {
   try{
       
       const { otp, phone } = req.body
       let data = await verifyOtp(otp, phone)
       if(data.status === 'approved'){
           return handleResponse({
               res,
               msg:'OTP verified successfully',
               data
           })}else{
                throw new ErrorHandler(400, 'OTP not verified. Please enter correct OTP')
           }}catch(error){
            logger.error(error)
                  if ((error.status === 404) & (error.code === 20404)) {
                         throw new ErrorHandler('OTP is expired')
                 }
            next(error)
     }
    
    
}

export {
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser,
    login,
    verifyLogin
}
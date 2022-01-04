import User from '../users/userModel.js'
import logger from '../../middlewares/logger.js'
import { getAllUsersService, deleteUserService, fetchByIdService, updateUserService } from './adminServcie.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import {sendOtp, verifyOtp, sendOTP } from '../../utils/sendOtp.js'
import { getUserByIdService } from '../users/userService.js'


const getAllUsers = async (req, res, next) => {
    logger.info('Inside getAllUser adminControllers')
    try {
        const data = await getAllUsersService()
        res.render('layouts/main', { data})
        // return handleResponse({ res, data })
    } catch (error) {
        logger.error(error)
        next(error)
    }


}

const getUserById = async (req, res, next) => {
    logger.info('Inside getUserById adminController')
    try{
        const { id } = req.params
        const user = await fetchByIdService(id)
        if(!user) throw new ErrorHandler(404, 'User not found')
        return handleResponse({
            res,
            msg:'Success',
            user
        })
    } catch(error) {
        logger.error(error)
        next(error)
    }
}

const updateUser = async(req, res, next)=>{
    logger.info('Inside updateUser adminController')
    try {
        const { id } = req.params
        let userObj = {
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            status: req.body.status,
            phoneNumber: req.body.phoneNumber,
            isVerified: req.body.isVerified
        }
      
        const user = await updateUserService(id, userObj)
        if(!user)
        throw new ErrorHandler(404, 'User not found')
        return handleResponse({
            res,
            msg:'User updated successfully',
            user
        })
    } catch (error) {
        logger.error(error)
        throw new Error(error.message)
        
    }
}

const deleteUser = async (req, res, next) => {
    logger.info('Inside deleteUser adminControllers')
    try {
        const user = await deleteUserService(req.params.id)
        return handleResponse({ res, user })
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
        return handleResponse({ res, user})
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
        return handleResponse({ res, msg:'User verified successfully'})
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
      
        if(!user || !(await user.verifyPassword(password, user.password))){
            throw new ErrorHandler (400, 'Incorrect email or password');
        }
        if(user.role !== 'admin')
            throw new ErrorHandler (404, 'User must be an admin');
       
        const phone = user.phoneNumber
        let otp = Math.floor(10000 + Math.random() * 90000)
        // sendOtp(phone)
         await sendOTP(otp, phone)
         user.otp = otp
         await user.save()
         return handleResponse({
            res,
            msg:'OTP sent to registered Mobile Number',
            data:user._id })

    }catch(error){
        logger.error(error)
        next(error)
    }
}
const verifyLogin = async (req, res, next) => {
   try{
        const { otp } = req.body
        const user = await User.findOne({otp})
        if(user.otp === otp){
         user.otp = null
         await user.save()
         const token = user.generateJwt()
         return handleResponse({res, data:user._id, token: token, msg:'OTP verified successfully'})
          } else{
              throw new ErrorHandler(403, 'Invalid OTP')
          }
    //    const { otp, phone } = req.body
    //    let data = await verifyOtp(otp, phone)
    //    if(data.status === 'approved'){
    //        return handleResponse({
    //            res,
    //            msg:'OTP verified successfully',
    //            data
    //        })}else{
    //             throw new ErrorHandler(400, 'OTP not verified. Please enter correct OTP')}
          }catch(error){
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
    verifyLogin,
    updateUser,
    getUserById
}
import {
    createService,
    getAllUsersService,
    getUserByIdService,
    updateService,
    deleteService,
    userVerificationService
} from './userService.js'
import crypto from 'crypto'
import User from './userModel.js'
import _ from 'lodash'
import sendEmail from '../../utils/mailer.js'
import AppError from '../../utils/appError.js'
import logger from '../../middlewares/logger.js'
import dotenv from 'dotenv'
import { handler } from '../../helpers/responseHandler.js'
dotenv.config()




const getAllUsers = async (req, res) => {
    logger.info('Inside getAllUser controller')
    try{
        const data = await getAllUsersService()
        return handler.handleResponse({ res, ...data})

    }catch(error){
        logger.error(error)
        handler.handleError({ res, error, data:error })
    }
}

const getUserById = async (req, res) => {
    logger.info('Inside getUserById Controller')
    try{
        const data =  await getUserByIdService(req.params.id)
        return handler.handleResponse({ res, ...data })

    }catch(error){
        logger.error(error)
        handler.handleError({ res, error, data:error })
    }
}
const updateUser = async (req, res)=>{
    logger.info('Inside updateUser Controller')
    try{
        var userDets = { 
            username:req.body.username,
            fullname:req.body.fullname,
            email:req.body.email,
            password:req.body.password,
            image:req.file.path
           
        }
        const data = await updateService(req.params.id, userDets)
        return handler.handleResponse({ res, ...data })

    }catch(error){
        logger.error(error)
        handler.handleError({res, error, data:error })
    }
}

const createUser =async (req, res) => {
    logger.info('Inside createuser Controller')
    try{
        var userObj = { 
            username:req.body.username,
            fullname:req.body.fullname,
            email:req.body.email,
            password:req.body.password,
            image:req.file.path,
            emailToken:crypto.randomBytes(32).toString('hex')
        }
        
        const emailData = { 
            reciever:userObj.email,
            sender:process.env.SENDER_EMAIL,
            emailToken:userObj.emailToken,
            host:req.headers.host,
            email:req.body.email
         }
       
        sendEmail(emailData)
        console.log(emailData)
        const data = await createService(userObj)
        return handler.handleResponse({ res, ...data })

    }catch(error){
        logger.error(error)
        handler.handleError({ res, error, data:error })
    }
   
}

const emailVerify = async (req, res) => {
    logger.info('Inside emailVerify Controller')
    
    try{
        const user = await User.findOne({emailToken: req.query.token})
        if(user){
            user.emailToken = null
            user.isVerified = true
            await user.save()
            return handler.handleResponse({ res, data:user.status, msg:'User verified'})
        } else
             return res.json({success: false, message:"Token is not valid"})
       
    }catch(err){
        logger.error(error.message)
        return handler.handleError({res, error, data:error})
    }
   
}


const deleteUser = async (req, res) => {
    logger.info('Inside deleteUser Controller')
    try{
        const data = await deleteService(req.params.id)
        return handler.handleResponse({ res, ...data, msg:'User deleted successfully'})
    }catch(error){
        logger.error(error)
        return handler.handleError({ res, error, data:error })
    }
   
}


const login = async (req, res, next) => {
    logger.info('Inside Login Controller')
    try{
        const {email, password} = req.body
        if(!email || !password){
           return next(new AppError('Please provide a email and password', 400))
        }
        const user = await User.findOne({email}).select('+password')
     
        if(!user || !(await user.verifyPassword(password, user.password))){
            return next(new AppError ('Incorrect email or password', 401))
        }
        const token = user.generateJwt()
        return handler.handleResponse({res, token:token })

    }catch(error) {
        logger.error(error)
        return handler.handleError({ res, error, data:error })
    }   


}
const userProfile = async (req, res, next) =>{
    logger.info('Inside userProfile Controller')
    try{
      const user = await  User.findOne({id: req.id })
                if (!user){
                    return handler.handleError({ res, error, data:user , msg:'User record not exists'})
                }else
                    return handler.handleResponse({ res, data:user })
                    // return res.status(200).json({ status: true, user : _.pick(user,['fullname','email', 'username']) });
            }catch(error){
        logger.error(error)
        return handler.handleError({res, error, data: error})
    }
    
}

export { 
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    userProfile, emailVerify

    }
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
import dotenv from 'dotenv'
dotenv.config()




const getAllUsers = async (req, res) => {
    const data = await getAllUsersService()
    return res.json(data)
}

const getUserById = async (req, res) => {
   const data =  await getUserByIdService(req.params.id)
   return res.json(data)
}
const updateUser = async (req, res)=>{
    var userDets = { 
        username:req.body.username,
        fullname:req.body.fullname,
        email:req.body.email,
        password:req.body.password,
        image:req.file.path
       
    }
    const data = await updateService(req.params.id, userDets)
     return res.status(301).json({
        status: 'success',
        data
    })
}

const createUser =async (req, res) => {
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
   return res.status(201).json({
       success: true,
       message: 'User registered successfully',
       data
   })
  
   
}

const emailVerify = async (req, res) => {
    
    try{
        const user = await User.findOne({emailToken: req.query.token})
        if(user){
            user.emailToken = null
            user.isVerified = true
            await user.save()
            res.json({success: true, message:`${user.fullname} is now verified.`, user})
        } else
             return res.json({success: false, message:"Token is not valid"})
       
    }catch(err){
        console.log(err.message)
    }
   
}


const deleteUser = async (req, res) => {
    const data = await deleteService(req.params.id)
    return res.status(301).json({
        status: 'success',
        data:{
            data
        }
    })
}


const login = async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
       return next(new AppError('Please provide a email and password', 400))
    }
    const user = await User.findOne({email}).select('+password')
 
    if(!user || !(await user.verifyPassword(password, user.password))){
        return next(new AppError ('Incorrect email or password', 401))
    }
    // if(!user.emailToken)
    // return  next(new AppError ('User not verified', 401))

    


    const token = user.generateJwt()
    res.status(200).json({
        status:'success',
        token
    })
}
const userProfile = (req, res, next) =>{
    User.findOne({id: req.id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullname','email', 'username']) });
        }
    );
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
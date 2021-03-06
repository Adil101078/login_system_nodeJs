import {
    createService,
    getAllUsersService,
    getUserByIdService,
    updateService,
    deleteService,
    userVerificationService
} from './userService.js'
import passport from 'passport'
import crypto from 'crypto'
import User from './userModel.js'
import _ from 'lodash'
import sendEmail from '../../utils/mailer.js'
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
    const {fullname, username, email, password} = req.body
    const {image} = req.path
    const {id} = req.params
    const data = await updateService(
        id,
        fullname,
        username,
        email,
        password,
        image
    )
    return res.json(data)
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
       reciever:req.body.email,
       sender:process.env.SENDER_EMAIL,
       emailToken:userObj.emailToken,
       host:req.headers.host,
       email:req.body.email
    }
  
   sendEmail(emailData)
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
    return res.status(201).json(data)
}


const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {       
       
        if (err) return res.status(400).json(err);
      
        else if (user) return res.status(200).json({ "token": user.generateJwt(), message: "Login successful"});
       
        else return res.status(404).json(info);
    })(req, res);
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
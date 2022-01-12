import {
  createService,
  getAllUsersService,
  getUserByIdService,
  updateService,
  deleteService,
  vendorRegisterService
} from "./userService.js";
import crypto from "crypto";
import User from "./userModel.js";
import _ from "lodash";
import Item from '../items/itemModel.js'
import logger from "../../middlewares/logger.js";
import { config } from "dotenv"
import {sendOTP} from '../../utils/sendOtp.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import {sendEmail, forgotPasswordLink, sendEmailToAdmin} from "../../utils/mailer.js";
config();

const getAllUsers = async (req, res, next) => {
  logger.info("Inside getAllUser Controller")
  try {
    const data = await getAllUsersService();
    return handleResponse({
      res,
      msg:'Users fetched',
      data
    })
  } catch (error) {
    logger.error(error.message);
    next(error)
  }
};

const getUserById = async (req, res, next) => {
  logger.info("Inside getUserById Controller");
  try {
    const { userId } = req.params
    const user = await User.findById({ _id: userId })
    if(!user) throw new ErrorHandler(404, 'User not found')
    const userDetails = await getUserByIdService(userId)
    return handleResponse({
      res,
      msg:'User details fetched successfully',
      data: userDetails
    });
  } catch (error) {
    logger.error(error.message);
    next(error)
  }
};
const updateUser = async (req, res, next) => {
  logger.info("Inside updateUser Controller")
  try {
    let loggedInUser = req.user._id
    const { userId } = req.params
    const { fullname, phoneNumber, email, password } = req.body
    let userDets = {
      fullname,
      email,
      password,
      phoneNumber,
      // image: req.file.path
    }
    const user = await User.findById({ _id: loggedInUser })
    if(user._id.toString() !== loggedInUser.toString())
      throw new ErrorHandler(401, 'Access denied')
    const data = await updateService(userId, userDets);
    return handleResponse({
      res,
      data,
      msg:'User updated successfully'
    })
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const createUser = async (req, res, next) => {
  logger.info("Inside createuser Controller");
  try {
    const { host } = req.headers
    const {
      username,
      email,
      password,
      fullname,
      phoneNumber
    } = req.body
    const user = await User.findOne({email});
    if(user){
      if ( user.email === email )
         throw new ErrorHandler(401, 'Email already exists')     
    } 
    const userPhone = await User.findOne({phoneNumber})
    if(userPhone){
      if(userPhone.phoneNumber === phoneNumber)
        throw new ErrorHandler(401, 'A user with this phone number already exists')   
   }
   let  emailToken = crypto.randomBytes(32).toString("hex")
    const userObj = {
      username,
      fullname,
      email,
      password,
      phoneNumber,
      emailToken,
      image: req.file.path,
     
    }
    const data = await createService(userObj)
    const emailData = {
      reciever: userObj.email,
      sender: process.env.SENDER_EMAIL,
      emailToken: emailToken,
      host: host,
      email: email,
      userId: data._id,
      fullname: userObj.fullname
    }
    sendEmail(emailData)
    return handleResponse({
      res,
      msg:'Please check your email to verify your account',
      data
    })

  } catch (error) {
    logger.error(error.message);
    next(error)
  }
};

const emailVerify = async (req, res, next) => {
  logger.info("Inside emailVerify Controller");

  try {
    const { token, userId } = req.query
    const user = await User.findById({ _id: userId })
    if(user === null)
      throw new ErrorHandler(404, 'User Id not found')
    if(user.emailToken === null)
      throw new ErrorHandler(422, 'User has been already verified.')
    if(user.emailToken !== token)
      throw new ErrorHandler(400, 'Invalid token')
    if(user.emailToken === token){
      const verifyUser = await User.findByIdAndUpdate(
        { _id: userId},
        { $set:{ emailToken: null, isVerified: true }},
        { new: true })
      return handleResponse({
        res,
        data: verifyUser,
        msg: "User verified",
      });

    }
  } catch (error) {
    logger.error(error.message);
    next(error)
  }
};

const deleteUser = async (req, res, next) => {
  logger.info("Inside deleteUser Controller");
  try {
    let loggedInUser = req.user._id
    const { userId } = req.params
    const user = await User.findById({ _id: userId})
    if(user === null)
      throw new ErrorHandler(404, 'User not found')
    if(user._id.toString() !== loggedInUser.toString())
      throw new ErrorHandler(401, 'You cannot delete others account')
    const data = await deleteService(userId)
    return handleResponse({
      res,
      data,
      msg: "User deleted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    next(error)
  }
};

const login = async (req, res, next) => {
  logger.info("Inside userLogin Controller");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorHandler(404, 'Missing required email and password fields')
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ErrorHandler(401, 'Email not registered');
    }
    if(!(await user.verifyPassword(password, user.password)))
      throw new ErrorHandler(403, 'Incorrect email or password')
    if (user.status === "inActive") {
      throw new ErrorHandler(401, 'Your account is inactive. Please contact administrator');
    }
    if (user.isVerified === false) {
      throw new ErrorHandler(401, 'Your account is not verified');
    
    }
    const token = user.generateJwt();
    return handleResponse({
      res,
      token: token,
      msg:'Login successfull',
      data:user
    });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};
const userProfile = async (req, res, next) => {
  logger.info("Inside userProfile Controller");
  try {
    let loggedInUser = req.user._id
    const user = await User.findById({ _id: loggedInUser });
    if (!user || user === null) {
      throw new ErrorHandler(400, 'User not found');
    } else
      return handleResponse({
        res,
        msg:'Profile fetched',
        data: user }); 
  } catch (error) {
    logger.error(error);
    next(error)
  }
}

const resetPassword = async(req, res, next)=>{
  logger.info('Inside resetPassword Controller')
  try {
    const { email } = req.body
    const { host } = req.headers
    const user = await User.findOne({email})
    if(email === null || !email)
      throw new ErrorHandler(400, 'Please provide the email')

    if(!user)
      throw new ErrorHandler(400, 'Email not registered')
      
    const resetToken = crypto.randomBytes(64).toString("hex")
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set:{ resetToken: resetToken }},
      { new: true })

    const emailData = {
        reciever: email,
        sender: process.env.SENDER_EMAIL,
        resetToken: resetToken,
        host: host,
        email: email,
        userId: user._id,
        fullname: user.fullname
      }
      forgotPasswordLink(emailData)
      return handleResponse({
        res,
        msg:'A link has been sent to your email to reset your password',
        data:updatedUser
      })

  } catch (err) {
    logger.error(err.message)
    next(err)
  }
}

const verifyResetToken = async(req, res, next)=>{
  logger.info('Inside verifyResetToken Controller')
  try {
    const { resetToken, userId } = req.params
    const { password, confirmPassword } = req.body
    const user = await User.findById({ _id: userId})
    if(user === null || user._id.toString() !== userId.toString())
     throw new ErrorHandler(401, 'Invalid user')
     
    if(user.resetToken === null)
       throw new ErrorHandler(404, 'Link expired')

    if(user.resetToken !== resetToken)
       throw new ErrorHandler(401, 'Invalid Token')


    if(password !== confirmPassword)
       throw new ErrorHandler(400, 'Passwords does not match')

    if(user){  
        
      const data = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { password: password, resetToken: null }},
        { new: true })
        return handleResponse({
          res,
          msg:'Password changed successfully',
          data
        })
    }
  } catch (err) {
    logger.error(err.message)
    next(err)
  }
}

const followerController = async(req, res, next)=>{
  logger.info('Inside follower Controller')
  try {
    const { userId } = req.params
    const  { loggedInUser }  = req.user._id
    const user = await User.findById({ _id: userId})

    if(user._id.toString() === loggedInUser.toString()){
      throw new ErrorHandler(404, 'You cannot follow yourself')
    } 
    if(user.followers.includes(loggedInUser)){
      const unfollowUser = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull:{ followers:loggedInUser }, $inc:{ followersCount:-1 }},
        { new: true })

      const updateFollowings = await User.findByIdAndUpdate(
        {_id:loggedInUser },
        { $pull:{ followings: userId }, $inc:{ followingsCount:-1 }},
        { new: true })
      return handleResponse({
        res,
        msg:`You unfollow ${user.fullname}`,
        data:{unfollowUser, updateFollowings}
      })
    }
    else{
      const followUser = await User.findByIdAndUpdate(
        { _id:userId },
        { $push:{ followers:loggedInUser }, $inc:{ followersCount:1 }},
        { new: true })
      const updateFollowers = await User.findByIdAndUpdate(
        { _id: loggedInUser },
        { $push:{ followings: userId}, $inc:{ followingsCount:1 }},
        { new: true })
      return handleResponse({
        res,
        msg:`You are following ${user.fullname}`,
        data:{ followUser, updateFollowers }
      })
    }
  } catch (err) {
    logger.error(err.message)
    next(err)
  }
}

const registerVendor = async(req, res, next)=>{
  logger.info('Inside registerVendor Controller')
    try {
        const { email, phoneNumber, fullname, password, vendorPurpose } = req.body
        const vendor = await User.findOne({email})
        if(vendor){
          if ( vendor.email === email )
             throw new ErrorHandler(401, 'A user with this email already exists')     
          } 
        const vendorPhone = await User.findOne({phoneNumber})
        if(vendorPhone){
          if(vendorPhone.phoneNumber === phoneNumber)
            throw new ErrorHandler(401, 'A user with this phone number already exists')   
        }
        let vendorObj = {
            email,
            password,
            fullname,
            phoneNumber,
            vendorPurpose
        }
        let emailData = {
            reciever:process.env.ADMIN_EMAIL,
            sender: process.env.SENDER_EMAIL,
            fullname: process.env.ADMIN_FULLNAME,
            vendorName:vendorObj.fullname,
            vendorEmail:vendorObj.email,
            purpose:vendorObj.purpose,
            phone:vendorObj.phoneNumber

        }
        
        sendEmailToAdmin(emailData)
        const newVendor = await vendorRegisterService(vendorObj)
        return handleResponse({
            res,
            msg:'Your application has been sent for admin approval. We will sent an email about your application status to your registered email within 24 hrs',
            statusCode:201,
            data: newVendor
        })
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}
const vendorLogin = async(req, res, next)=>{
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
      if(user.role !== 'vendor')
          throw new ErrorHandler (401, 'User must be vendor');
      if(user.status !== 'active')
          throw new ErrorHandler(401, 'Your account is not activated')    
     
      const phone = user.phoneNumber
      let otp = Math.floor(10000 + Math.random() * 90000)
      // sendOtp(phone)
       await sendOTP(otp, phone)
       user.otp = otp
       await user.save()
       return handleResponse({
          res,
          msg:'OTP sent to registered Mobile Number',
          data:user })

  }catch(error){
      logger.error(error.message)
      next(error)
  }
}
const verifyVendorLogin = async (req, res, next) => {
  try{
       const { otp } = req.body
       const user = await User.findOne({otp})
       if(user.otp === otp){
        user.otp = null
        await user.save()
        const token = user.generateJwt()
        return handleResponse({res, data:user, token: token, msg:'OTP verified successfully'})
         } else
           throw new ErrorHandler(403, 'Invalid OTP')
         
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
           logger.error(error.message)
                 if ((error.status === 404) & (error.code === 20404)) {
                        throw new ErrorHandler('OTP is expired')
                }
           next(error)
    }
   
   
}

const vendorProfile = async(req, res, next)=>{
  logger.info('Inside vendorProfile Controller')
  try {
    let vendorId = req.user._id
    let loggedInVendor = req.user
    console.log(loggedInVendor.role)
    const vendor = await User.findById({_id: vendorId})
    console.log(vendor._id)
    if(vendor.role !== loggedInVendor.role)
      throw new ErrorHandler(404, 'User must be vendor')
    if(!vendor || vendor === null)
      throw new ErrorHandler(404, 'Vendor not found')
    
    
    const items = await Item.find({createdBy: vendorId})
       if(items === null)
          throw new ErrorHandler(400, 'No items found')
        return handleResponse({
          res,
          msg:'Items fetched',
          data:{vendor, items}
        })
    
   
   
   
  } catch (err) {
    logger.error(err.message)
    next(err)
  }
}

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  userProfile,
  emailVerify,
  resetPassword,
  verifyResetToken,
  followerController,
  registerVendor,
  vendorLogin,
  verifyVendorLogin,
  vendorProfile
};

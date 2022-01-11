import {
  createService,
  getAllUsersService,
  getUserByIdService,
  updateService,
  deleteService
} from "./userService.js";
import crypto from "crypto";
import User from "./userModel.js";
import _ from "lodash";
import {sendEmail, forgotPasswordLink } from "../../utils/mailer.js";
import logger from "../../middlewares/logger.js";
import dotenv from "dotenv"
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
dotenv.config();

const getAllUsers = async (req, res, next) => {
  logger.info("Inside getAllUser controller");
  try {
    const data = await getAllUsersService();
    return handleResponse({ res, ...data });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const getUserById = async (req, res, next) => {
  logger.info("Inside getUserById Controller");
  try {
    const user = await getUserByIdService(req.params.id);
   
    if(!data){
      throw new Error(404, 'No such user found')
    }
    return handleResponse({ res, statusCode:202, msg:'User details fetched successfully' ,data:user });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};
const updateUser = async (req, res, next) => {
  logger.info("Inside updateUser Controller");
  try {
    const { id } = req.params
    var userDets = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      image: req.file.path,
      phoneNumber: req.body.phoneNumber
    };
    const data = await updateService(id, userDets);
    return handleResponse({ res, ...data, msg:'User updated successfully' });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const createUser = async (req, res, next) => {
  logger.info("Inside createuser Controller");
  try {
    const { email, phoneNumber } = req.body
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

    
    const userObj = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      // image: req.file.path,
      phoneNumber: req.body.phoneNumber,
      emailToken: crypto.randomBytes(32).toString("hex")
    };

    const emailData = {
      reciever: userObj.email,
      sender: process.env.SENDER_EMAIL,
      emailToken: userObj.emailToken,
      host: req.headers.host,
      email: req.body.email
    };

    sendEmail(emailData);

    const data = await createService(userObj);
    return handleResponse({
      res,
      msg:'Please check your email to verify your account',
      ...data
    });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const emailVerify = async (req, res, next) => {
  logger.info("Inside emailVerify Controller");

  try {
    const { token } = req.query
    const user = await User.findOne({ emailToken:token });
    if (!user) {
      throw new ErrorHandler(422, 'Token not valid');
    } 
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    return handleResponse({
      res,
      data: user.email,
      msg: "User verified",
    });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const deleteUser = async (req, res, next) => {
  logger.info("Inside deleteUser Controller");
  try {
    const { id } = req.params
    const data = await deleteService(id);
    if(!data)
      throw new ErrorHandler(404, 'User record not found')
    return handleResponse({
      res,
      ...data,
      msg: "User deleted successfully",
    });
  } catch (error) {
    logger.error(error);
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
      data:user.email
    });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};
const userProfile = async (req, res, next) => {
  logger.info("Inside userProfile Controller");
  try {
    const user = await User.findOne({ _id: req.user });
    if (!user) {
      throw new ErrorHandler(400, 'User not found');
    } else return handleResponse({ res, data: user }); 
  } catch (error) {
    logger.error(error);
    next(error)
  }
}

const resetPassword = async(req, res, next)=>{
  logger.info('Inside resetPassword Controller')
  try {
    const { email } = req.body
    if(email ==null) throw new ErrorHandler(400, 'Please provide the email')
    const user = await User.findOne({email})
    if(!user)
      throw new ErrorHandler(400, 'Email not registered')
    const resetToken = crypto.randomBytes(32).toString("hex") + user.password
    user.resetToken = resetToken
    await user.save()
    const emailData = {
        reciever: user.email,
        sender: process.env.SENDER_EMAIL,
        resetToken:resetToken,
        host: req.headers.host,
        email: req.body.email,
        userId: req.params.userId
      }
      forgotPasswordLink(emailData)
      return handleResponse({
        res,
        msg:'A link has been sent to your email to reset your password',
        data:user.resetToken
      })

  } catch (err) {
    logger.error(err)
    next(err)
  }
}

const verifyResetToken = async(req, res, next)=>{
  logger.info('Inside verifyResetToken Controller')
  try {
    const { resetToken, userId } = req.params
    const { password, confirmPassword } = req.body
    const userResetToken = await User.findOne({resetToken:resetToken})
    if(!userResetToken)
      throw new ErrorHandler(401, 'Link has been expired')
    const user = await User.findOne({_id:userId})
    if(!user)
      throw new ErrorHandler(401, 'Invalid user')
    if(password !== confirmPassword)
      throw new ErrorHandler(400, 'Passwords does not match')
     
      if(user){        
        const userObj = {
          password:req.body.password,
          resetToken:null
        }
        
        const data = await User.updateOne(userObj)
        return handleResponse({
          res,
          msg:'Password changed successfully',
          data:data
        })
    }
  } catch (err) {
    logger.error(err)
    next(err)
  }
}

const followerController = async(req, res, next)=>{
  logger.info('Inside follower Controller')
  try {
    const { id } = req.params
    const  userId  = req.user._id
    const user = await User.findById(id)

    if(user._id.toString() === userId.toString()){
      throw new ErrorHandler(404, 'You cannot follow yourself')
    } 
    if(user.followers.includes(userId)){
      await User.updateOne({
        _id:id
      },
        {$pull:
          { followers:userId },
          $inc:
          { followersCount:-1 }
        },
        {
          new: true
        }
        )
      await User.updateOne({_id:userId },
        { $pull:
          { followings:id }, 
          $inc:
          { followingsCount:-1 }
        },
        {
          new: true
        }
        )
      return handleResponse({
        res,
        msg:`You unfollow ${user.fullname}`,
        data:user._id
      })
    }
     else{
     await User.updateOne({
       _id:id
      },
      { $push:
        { followers:userId },
        $inc:
        { followersCount:1 }
      }, {
        new: true
      })
     await User.updateOne({
       _id: userId
      },
      {
        $push:
        { followings: id},
        $inc:
        { followingsCount:1 }
      },
      {
        new: true
      })
      return handleResponse({
        res,
        msg:`You are following ${user.fullname}`,
        data:user._id
      })
    }
  } catch (err) {
    logger.error(err)
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
  followerController
};

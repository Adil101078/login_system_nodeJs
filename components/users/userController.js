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
import sendEmail from "../../utils/mailer.js";
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
    const data = await getUserByIdService(req.params.id);
    return handleResponse({ res, ...data });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};
const updateUser = async (req, res, next) => {
  logger.info("Inside updateUser Controller");
  try {
    var userDets = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      image: req.file.path,
    };
    const data = await updateService(req.params.id, userDets);
    return handleResponse({ res, ...data, msg:'User updated successfully' });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const createUser = async (req, res, next) => {
  logger.info("Inside createuser Controller");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new ErrorHandler(401, 'Email already exists')
    }
    const userObj = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      image: req.file.path,
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
    return handleResponse({ res, ...data });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

const emailVerify = async (req, res, next) => {
  logger.info("Inside emailVerify Controller");

  try {
    const user = await User.findOne({ emailToken: req.query.token });
    if (!user) {
      throw new ErrorHandler(422, 'Token not valid');
    } 
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    return handleResponse({
      res,
      data: user,
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
    const data = await deleteService(req.params.id);
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

    if (!user || !(await user.verifyPassword(password, user.password))) {
      throw new ErrorHandler(401, "Incorrect email or password");
    }
    if (user.status === "inActive") {
      throw new ErrorHandler(401, 'Your account is inactive. Please contact administrator');
    }
    if (user.isVerified === false) {
      throw new ErrorHandler(401, 'Your account is not verified');
    
    }
    const token = user.generateJwt();
    return handleResponse({ res, token: token });
  } catch (error) {
    logger.error(error);
    next(error)
  }
};
const userProfile = async (req, res, next) => {
  logger.info("Inside userProfile Controller");
  try {
    const user = await User.findOne({ id: req.id });
    if (!user) {
      throw new ErrorHandler(400, 'User not found');
    } else return handleResponse({ res, data: user }); 
  } catch (error) {
    logger.error(error);
    next(error)
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  userProfile,
  emailVerify,
};

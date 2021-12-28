import User from '../components/users/userModel.js'
import AppError from '../utils/appError.js';
import logger from './logger.js'
import {handler} from '../helpers/responseHandler.js';


const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  logger.info('Inside CheckDuplicateUsernameOrEmail Function')
  // Username
  try{
    const {username, email} = req.body
    const userName = await User.findOne({username})
    if(userName){
      return next(new AppError(`Failed!, Userrname '${userName.username}' is already in use`))
    }
     // Email
  const userEmail = await User.findOne({email})
  if(userEmail){
    return next(new AppError(`Failed!, Email '${userEmail.email}' is already registered`))
  }
  next()
  }catch(error){
    logger.error(error);
    return handler.handleError({ res, error, data: error })
  }
  
};


export default checkDuplicateUsernameOrEmail;
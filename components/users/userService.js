import User from  './userModel.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler } from '../../helpers/globalHandler.js'

const createService = async (data, next)=>{
  logger.info('Inside createUser Servcie')
  try {
    const result = await User.create(data)
    return result
  } catch (error) {
    logger.error(error)
       next(error)
  }
    
  }
const getAllUsersService = async(next)=>{
  logger.info('Inside getAllusers Service')
  try{
    const data = await User.find({})
    return {data:data}

  }catch(error){
    logger.error(error)
    next(error)
  }
}

const getUserByIdService = async(userId, next)=>{
  logger.info('Inside getUserById Service')
  try{
    
      const result = await User.findById(userId)
        if(result)
         return result
    
      throw new ErrorHandler(404, 'No user found by given Id')

  }catch(error){
    logger.error(error.message)
    next(error)
  }
}
const deleteService = async(userId, next)=>{
  logger.info('Inside deleteUser Service')
  try{
    const result = await User.findByIdAndRemove(userId)
    if(!result)
      throw new ErrorHandler(404, 'user record not found')
    return result

  }catch(error) {
    logger.error(error.message)
    next(error)
  }
}
const updateService = async(userId, obj, next)=>{
  logger.info('Inside updateUser Service')
  try{
    const userDetails = await User.findByIdAndUpdate(userId, obj, {new:true} )
    if(!userDetails)
      throw new ErrorHandler(404, 'User not found')
    return userDetails

  }catch(error){
    logger.error(error.message)
    next(error)
  }
  
}

const vendorRegisterService = async(vendorObj, next)=>{
  logger.info('Inside vendorRegister Service')
  try {
    const newVendor = await User.create(vendorObj)
      return newVendor
  } catch (err) {
    logger.error(err.message)
    next(err)
  }
}

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService,
  vendorRegisterService
}
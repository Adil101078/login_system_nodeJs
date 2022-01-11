import User from  './userModel.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler } from '../../helpers/globalHandler.js'

const createService = async (data, next)=>{
  logger.info('Inside createUser Servcie')
  try {
    const result = await User.create(data)
    return {data:result}
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

const getUserByIdService = async(id)=>{
  logger.info('Inside getUserById Service')
  try{
    
      const result = await User.findById(id)
        if(result)
         return result
    
      throw new ErrorHandler(404, 'No user found by given Id')

  }catch(error){
    logger.error(error)
     throw new Error(error)
  }
}
const deleteService = async(id, next)=>{
  logger.info('Inside deleteUser Service')
  try{
    const result = await User.findByIdAndRemove(id)
    if(!result)
      throw new ErrorHandler(404, 'user record not found')
    return {data:result}

  }catch(error) {
    logger.error(error)
    next(error)
  }
}
const updateService = async(id, obj, next)=>{
  logger.info('Inside updateUser Service')
  try{
    const userDetails = await User.findByIdAndUpdate(id, obj, {new:true} )
    if(!userDetails)
      throw new ErrorHandler(404, 'User not found')
    return { data: userDetails }

  }catch(error){
    logger.error(error)
    next(error)
  }
  
}

// const resetPassword = async(obj,next)=>{
//   logger.info('Inside resetPassword Service')
//   try {
//     const getUser = await User.findOne(obj)
//     if(!getUser) throw new ErrorHandler(400, 'User not exists')
//     return getUser
//   } catch (err) {
//     logger.error(err)
//     next(err)
//   }
// }

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService
}
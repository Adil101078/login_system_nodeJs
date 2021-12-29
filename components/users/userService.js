import User from  './userModel.js'
import logger from '../../middlewares/logger.js'

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

const getUserByIdService = async(id, next)=>{
  logger.info('Inside getUserById Service')
  try{
    const result = await User.findById(id)
    return {data: result}

  }catch(error){
    logger.error(error)
    next(error)
  }
}
const deleteService = async(id, next)=>{
  logger.info('Inside deleteUser Service')
  try{
    const result = await User.findByIdAndRemove(id)
    return {data:result}

  }catch(error) {
    logger.error(error)
    next(error)
  }
}
const updateService = async(id, obj, next)=>{
  logger.info('Inside updateUser Service')
  try{
    const userDetails = await User.findByIdAndUpdate(id, obj, {new:true})
    return ({ data: userDetails })

  }catch(error){
    logger.error(error)
    next(error)
  }
  
}

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService
}
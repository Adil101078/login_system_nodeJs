import User from  './userModel.js'
import logger from '../../middlewares/logger.js'
import { handler } from '../../helpers/responseHandler.js'

const createService = async (data)=>{
  logger.info('Inside createUser Servcie')
  try {
    const result = await User.create(data)
    return {data:result}
  } catch (error) {
    logger.error(error)
       return error
  }
    
  }
const getAllUsersService = async()=>{
  logger.info('Inside getAllusers Service')
  try{
    const data = await User.find({})
    return {data:data}

  }catch(error){
    logger.error(error)
    return error
  }
}
const userVerificationService = async()=>{
  logger.info('Inside userVerification Service')
  try{
    const user = await User.findOne({emailToken: token})
    if(user){
      user.emailToken = null,
      user.isVerified = true
      await user.save()
      return {data:user}
    }else
    return res.json({success:false, message:"Token invalid"})

  }catch(error){
    logger.error(error)
    return error
  }
}

const getUserByIdService = async(id)=>{
  logger.info('Inside getUserById Service')
  try{
    const result = await User.findById(id)
    return {data: result}

  }catch(error){
    logger.error(error)
    return error
  }
}
const deleteService = async(id)=>{
  logger.info('Inside deleteUser Service')
  try{
    const result = await User.findByIdAndRemove(id)
    return {data:result}

  }catch(error) {
    logger.error(error)
    return error
  }
}
const updateService = async(id,obj)=>{
  logger.info('Inside updateUser Service')
  try{
    const userDetails = await User.findByIdAndUpdate(id, obj, {new:true})
    return ({
      message: 'User updated successfully',
      data: userDetails
    })

  }catch(error){
    logger.error(error)
    return error
  }
  
}

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService,
  userVerificationService
}
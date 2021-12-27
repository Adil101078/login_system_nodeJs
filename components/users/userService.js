import User from  './userModel.js'
import mongoose from 'mongoose'

const createService = async (data)=>{
     const result = await User.create(data)
    return {data:result}
  }
const getAllUsersService = async()=>{
  const result = await User.find({})
  return {data:result}
}
const userVerificationService = async()=>{
  const user = await User.findOne({emailToken: token})
  if(user){
    user.emailToken = null,
    user.isVerified = true
    await user.save()
    return {data:user}
  }else
  return res.json({success:false, message:"Token invalid"})
}

const getUserByIdService = async(id)=>{
  const result = await User.findById(id)
  return {data:result}
}
const deleteService = async(id)=>{
  const result = await User.findByIdAndRemove(id)
  return {data:result}
}
const updateService = async(id,obj)=>{
  const userDetails = await User.findByIdAndUpdate(id, obj, {new:true})
  return ({
    message: 'User updated successfully',
    userDetails
  })
}

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService,
  userVerificationService
}
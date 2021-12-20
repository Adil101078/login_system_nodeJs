import User from  './userModel.js'
import mongoose from 'mongoose'

const createService = async (userObj)=>{
     const result = await User.create(userObj)
    return {data:result}
  }
const getAllUsersService = async()=>{
  const result = await User.find().populate({ path:'posts', model:'Post'})
  return {data:result}
}

const getUserByIdService = async(id)=>{
  const result = await User.findById(id).populate('posts')
  return {data:result}
}
const deleteService = async(id)=>{
  const result = await User.findByIdAndRemove(id)
  return {data:result}
}
const updateService = async(id,fullname, username, email, password, image)=>{
  const userDetails = await User.findOneAndUpdate(
      {
    _id: mongoose.Types.ObjectId(id),
  },
        {
    $set: {
      ...(fullname && {
        fullname,
      }),
      ...(username && {
        username,
      }),
      ...(email && {
        email,
      }),
      ...(password && {
        password,
      }),
      ...(image && {
        image,
      })
    },
  },
  { new: true }
  )
  return {data:userDetails}
}

export {
  createService,
  getAllUsersService,
  getUserByIdService,
  deleteService,
  updateService
}
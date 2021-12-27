import User from '../users/userModel.js'
import AppError from '../../utils/appError.js'
import catchAsync from '../../utils/catchAsync.js'

const getAllUsersService = async (next) => {
    const users = await User.find({})
    if(!users){
        return next(new AppError('No records found', 404))
    }
    return {data:users}
}

const deleteUserService = async (id, next) => {
    const user = await User.findOneAndRemove(id)
    if(!user){
        return next(new AppError('No records found', 404))
    }
    return user
}

const disableUserService = catchAsync(async()=>{
    const user = await User.findOne({email})
    if(!user){
        return new AppError('No records found', 404)
    }
    user.status = 'inActive',
    user.isVerified = false
    await user.save()
    return user
    
})



export {
    getAllUsersService,
    disableUserService,
    deleteUserService
    
}
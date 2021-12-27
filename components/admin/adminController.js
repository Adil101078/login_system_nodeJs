import { 
    getAllUsersService,
    deleteUserService,
} from './adminServcie.js'
import catchAsync from '../../utils/catchAsync.js'
import User from '../users/userModel.js'


const getAllUsers = catchAsync( async(req, res, next)=>{
    const allUsers = await getAllUsersService()
    res.status(200).json({
        status:'success',
        message: 'Fetched all users successfully',
        allUsers
    })
})

const deleteUser = catchAsync( async(req, res, next)=>{
    const user = await deleteUserService(req.params.id)
    res.status(203).json({
        status:'success',
        message: `User with ID: ${user._id} is deleted successfully`,
        user
    })
})

const disableUser = catchAsync( async(req, res, next)=>{
    const user = await User.findOne({email:req.body.email})
    user.status = 'inActive',
    user.isVerified = false
    await user.save()
    res.status(201).json({
        status: 'success',
        message:'User is disabled',
        user
    })
})

const enableUser = catchAsync( async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email})
    user.status = 'active',
    user.isVerified = true,
    user.emailToken = null
    await user.save()
    res.status(200).json({
        status: 'success',
        message: 'User is enabled',
        user
    })
})

export {
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser
}
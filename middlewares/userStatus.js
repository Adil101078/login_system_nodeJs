import User from '../components/users/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

const checkUserStatus = catchAsync( async (req, res, next)=>{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return next(new AppError('User with this email address not exists', 401))
        }
        if(user.isVerified === false){
            return next(new AppError('You are not verified. Please check your email to verify your account', 401))
        }
        if(user.status === 'inActive'){
            return next(new AppError('Your account is temporarily inactive. Please contact Administrator', 401))
        }
        next()
})

export default checkUserStatus
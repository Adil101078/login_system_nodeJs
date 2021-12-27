import User from '../components/users/userModel.js';
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

const checkRole = catchAsync( async(req, res, next)=>{
    const userRole = await User.findOne({email: req.body.email})
    if(!userRole.role === 'admin'){
        return next(new AppError('Access denied', 401))
    }
    next()
})
export default checkRole
import User from '../components/users/userModel.js'
import AppError from '../utils/appError.js'
import {handler} from '../helpers/responseHandler.js'

const checkRole =  async(req, res, next)=>{
    try{
        const userRole = await User.findOne({email: req.body.email})
        if(!userRole.role === 'admin'){
            return next(new AppError('Access denied', 401))
            // return handler.unAuthorized({res,
            //     statusCode: 401,
            //     data: 'Unauthorized! Access denied.' })
        }
        next()

    }catch(e){
        return handler.handleError({e:err})
    }
   
}
export default checkRole
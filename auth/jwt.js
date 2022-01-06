import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ErrorHandler } from '../helpers/globalHandler.js'
import logger from '../middlewares/logger.js'
import User from '../components/users/userModel.js'
dotenv.config()

const verifyToken = (req, res, next) => {
  try {
    let token
    if ('authorization' in req.headers)
      token = req.headers['authorization'].split(' ')[1]

    if (!token)
      throw new ErrorHandler(401, 'Please Login to continue')
    else {
      jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err)
        throw new ErrorHandler(401, 'Seesion expires. Please login to continue')
        else {
          const{_id } = payload
          User.findById(_id).then(userData=>{
            req.user = userData
            next()
          })
          // req._id = decoded._id
          // next()
        }
      })
    }
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

export default verifyToken

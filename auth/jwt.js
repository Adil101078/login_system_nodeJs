import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ErrorHandler } from '../helpers/globalHandler.js'
import logger from '../middlewares/logger.js'
dotenv.config()

const verifyToken = (req, res, next) => {
  try {
    let token
    if ('authorization' in req.headers)
      token = req.headers['authorization'].split(' ')[1]

    if (!token)
      throw new ErrorHandler(403, 'No token provided')
    else {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err)
        throw new ErrorHandler(500, 'Token authentication failed')
        else {
          req._id = decoded._id
          next()
        }
      })
    }
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

export default verifyToken

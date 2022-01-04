import postComment from './commentModel.js'
import Post from '../../components/posts/postModel.js'
import { ErrorHandler } from '../../helpers/globalHandler.js'
import logger from '../../middlewares/logger.js'

const createCommentService = async ( commentObj)=>{
    logger.info('Inside postComment Service')
    try{
        const data = await postComment.create(commentObj)
         return data
    } catch(error){
        logger.error(error)
        return error.message
    }
}
const deleteCommentService = async(id, next)=>{
    logger.info('Inside deleteComment Service')
    try {
        const data = await postComment.findByIdAndRemove(id)
        if(!data._id) throw new ErrorHandler(404, 'Comment not found')
        return data
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
const getAllCommentsService = async(next)=>{
    logger.info('Inside getAllComment Service')
    try {
        const data = await postComment.find()
        .populate({ path:'userId', select:'fullname'})
        .populate({ path:'postId', select:'name'})
        if(!data) throw new ErrorHandler(404, 'No comments found')
        return data
    } catch (err) {
        logger.error(err)
        next(err)
    }
}

export {
    createCommentService,
    deleteCommentService,
    getAllCommentsService
}
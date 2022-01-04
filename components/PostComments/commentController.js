import { createCommentService, deleteCommentService, getAllCommentsService } from './commentService.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import Post from '../posts/postModel.js'
import mongoose from 'mongoose'


const createComment = async(req, res, next)=>{
    logger.info('Inside createComment Controller')
    try {
        let postId = req.params.postId
       const findPost = await Post.findOne({_id:postId})
        if(!findPost) throw new ErrorHandler(404, 'No post found')
        if(!mongoose.Types.ObjectId.isValid(postId)) throw new ErrorHandler(4404, 'Invalid post id')

        let commentObj = {
            description:req.body.description,
            userId:req.body.userId,
            postId:req.params.postId
        }
        
        const newComment = await createCommentService(commentObj)
        const addCommentId = await Post.updateOne({_id:postId},{ $push:{comments:newComment._id}})
        if(!newComment) throw new ErrorHandler(404, 'Comment not added. Error!!')
          return handleResponse({
              res,
              msg:'Comment added successfully',
              data:newComment
          })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const deleteComment = async(req, res, next)=>{
    logger.info('Inside deleteComment Controller')
    try {
        const { id } = req.params
        const data = await deleteCommentService(id)
        if(!mongoose.Types.ObjectId.isValid(id) || !data) throw new ErrorHandler(4404, 'Invalid post id')
        return handleResponse({
            res,
            msg:'Comment deleted successfully',
            data: data
        })


    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getAllComments = async(req, res, next)=>{
    logger.info('Inside getAllComment Controller')
    try {
        // const { postId } = req.params.postId
        const data = await getAllCommentsService()
        if(!data) throw new ErrorHandler(404, 'No comment found')
        return handleResponse({
            res,
            data
        })
    } catch (err) {
        logger.error(err)
        next(err)
    }
}
export {
    createComment,
    deleteComment,
    getAllComments
}
import {
    createService,
     getAllPostsService,
     getPostByIdService,
     updateService,
     deleteService
    } from './postService.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import logger from '../../middlewares/logger.js'
import Post from './postModel.js'
import User from '../users/userModel.js'

const getAllPosts = async (req, res, next) => {
    logger.info('Inside getAllPost Controller')
    try {
        const data = await getAllPostsService()
        if(!data)
           throw new ErrorHandler(400, 'No records found')
        return handleResponse({ 
            res,
            msg:'Fetched all Posts',
            data
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getPostById = async (req, res, next) => {
    logger.info('Inside getPostById Controller')
    try{
        const { postId } = req.params
        const data =  await getPostByIdService(postId)
        if(!data)
          throw new ErrorHandler(400, 'No record found')
        return handleResponse({ 
            res,
            data
        })
    }catch(error){
        logger.error(error)
        next(error)
    }
}
const updatePost = async (req, res, next)=>{
    logger.info('Inside updatePost Controller')
    try {
        let loggedInUser = req.user._id
        const { postId } = req.params
        const { name, description } = req.body
        let updateObj = {
           name,
           description,
           postedBy: loggedInUser
       }
       const data = await Post.findById({_id: postId })
       if(data.postedBy.toString() !== loggedInUser.toString())
            throw new ErrorHandler(401, 'You can only update your posts')

       const updatePost = await updateService(postId, updateObj )
        return handleResponse({
            res,
            msg:'Post updated successfully',
            data:updatePost
        })
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}

const createPost =async (req, res, next) => {
    logger.info('Inside createPost Controller')
    try {
        let loggedInUser = req.user._id
        const {name, description} = req.body        
        const postObj = {
            name,
            description,
            postedBy: loggedInUser
        }
        const data = await createService(postObj)
        return handleResponse({
            res,
            msg:'Post created',
            data
            })
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}


const deletePost = async (req, res, next) => {
    logger.info('Inside deletePost Controller')
    try {
        let loggedInUser = req.user._id
        const { postId } = req.params
        const post = await Post.findOne({ postId })
        if(post.postedBy._id.toString() !== loggedInUser.toString())
            throw new ErrorHandler(401, 'You can delete only your post')
        if(!post)
            throw new ErrorHandler(404, 'Post not found')

        const data = await deleteService(postId)
        return handleResponse({
            res,
            msg:'Post deleted',
            data
        })
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}
const likePostController = async (req, res, next) => {
    logger.info('Inside likePost Controller')
    try {
        let loggedInUser = req.user
        const { postId } = req.params
        const post = await Post.findById({postId})
        if(!post.likes.includes(loggedInUser._id)){
            const postLiked = await Post.findByIdAndUpdate(
               {_id: postId },
               { $push:{ likes:loggedInUser }},
               { new: true })

            return handleResponse({
                res,
                msg:`Post has been liked by ${loggedInUser.fullname}`,
                data:postLiked
                
            })
        } else{
            const postUnliked = await Post.findByIdAndUpdate(
               {_id: postId },
               { $pull:{ likes:loggedInUser._id }},
               { new: true } )
            
            return handleResponse({
                res,
                msg:`Post has been disliked by ${loggedInUser.fullname}`,
                data:postUnliked
                
            })
        }
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}
const addCommentController = async(req, res, next)=>{
       try{
            let loggedInUser = req.user
            const { postId } = req.params
            const { text } = req.body
            const commentObj = {
                text,
                commentedBy: loggedInUser._id
            }
           
            const post = await Post.findById({ _id: postId })
            .populate('comments.commentedBy', '_id fullname')
            .populate('postedBy', 'fullname')
            if(!post || post === null)
                throw new ErrorHandler(404, 'Post not found')
            const addComment = await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { comments:commentObj }},
                { new: true })
                return handleResponse({
                   res,
                   msg:`${loggedInUser.fullname} commented on ${post.postedBy.fullname}'s post`,
                   data: addComment
                })
               
       } catch(error){
           logger.error(error.message)
           next(error)
       }
}

const deleteCommentController = async(req, res, next)=>{
    logger.info('Inside deleteComment Controller')
    try {
        let loggedInUser = req.user
        const { postId, commentId } = req.params
        const data = await Post.findOne({ _id: postId })        
        let findComments = data.comments.filter( x=> 
            x.commentedBy.toString() === loggedInUser._id.toString()
            )
        let match = data.comments.find(x=>
            x._id.toString() === commentId.toString()
            )
        if(typeof findComments !== "undefined"){
            if(typeof match !== "undefined"){
                await match.remove()
                await data.save()
                return handleResponse({
                  res,
                  msg:`Comment deleted successfully`,
                  data:match
                  }) 
            } else {
                throw new ErrorHandler(401, 'Comment not found')
            }
            
       } else{
           throw new ErrorHandler(401, 'You can delete only your comments')
       }
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const likeCommentController = async(req, res, next)=>{
    logger.info('Inside likeComment Controller')
    try {
        let loggedInUser = req.user
        const { postId, commentId } = req.params
        const post = await Post.findOne({_id: postId })
        let like = post.comments.find(x=>
            x._id.toString() === commentId.toString()
        )?.likes
        if(typeof like !== "undefined"){

            if(!like.includes(loggedInUser._id)){
                
                const data = await  Post.findByIdAndUpdate(
                    {_id: postId, "comments._id": commentId },
                    { $push: {"comments.$.likes": loggedInUser._id }},
                    { new: true });
                return handleResponse({
                    res,
                    msg:`Comment liked by ${loggedInUser.fullname}`,
                    data
                })
            } else {
        }
            const data = await Post.findByIdAndUpdate(
                { _id: postId, 'comments._id': commentId },
                { $pull:{ 'comments.$.likes': loggedInUser._id }},
                { new: true })
            return handleResponse({
                res,
                msg:`Comment disliked by${loggedInUser.fullname}`,
                data:data
            })
        }
        throw new ErrorHandler(404, 'comment Id not found')
    } catch (err) {
        logger.error(err)
        next(err)
    }
}



export { 
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePostController,
    addCommentController,
    deleteCommentController,
    likeCommentController

    }
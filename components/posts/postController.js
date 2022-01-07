import {
    createService,
     getAllPostsService,
     getPostByIdService,
     updateService,
     deleteService
    } from './postService.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import Post from './postModel.js'

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
        const data =  await getPostByIdService(req.params.id)
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
        const { id } = req.params
        let updateObj = {
           name: req.body.name,
           description: req.body.description,
           postedBy: req.user._id
       }
       const data = await Post.findById({_id: id})
       if(data.postedBy.toString() !== req.user._id.toString())
            throw new ErrorHandler(401, 'You can only update your posts')

       const updatePost = await updateService(id, updateObj )
        return handleResponse({
            res,
            msg:'Post updated successfully',
            data:updatePost
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const createPost =async (req, res, next) => {
    logger.info('Inside createPost Controller')
    try {
        const {name, description} = req.body
        const postObj = { name, description, postedBy:req.user._id}
        const data = await createService(postObj)
        console.log(postObj)
        return handleResponse({
            res,
            msg:'Post created',
            data
        })
        
    } catch (error) {
        logger.error(error)
        next(error)
    }
}


const deletePost = async (req, res, next) => {
    logger.info('Inside deletePost Controller')
    try {
        const {id} = req.params
        const data = await deleteService(id)
        console.log(data.postedBy._id)
        if(!data)
            throw new ErrorHandler(400, 'No record found')
        if(data){

            if(data.postedBy._id.toString() !== req.user._id.toString()) 
                throw new ErrorHandler(401, 'You can only delete post posted by you')
            await data.remove()
            return handleResponse({
                res,
                data,
                msg:'Post deleted successfully'
            })
        }
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}
const likePostController = async (req, res, next) => {
    logger.info('Inside likePost Controller')
    try {
        const {id} = req.params
        const post = await Post.findById(id)
        if(!post.likes.includes(req.user._id)){
            await Post.updateOne( {_id:id}, {
                $push:{
                    likes:req.user._id
                }
            },
            { new: true }
            )
            return handleResponse({
                res,
                msg:`Post has been liked by ${req.user.fullname}`
                
            })
        } else{
            await Post.updateOne( {_id:id}, {
                $pull:{
                    likes:req.user._id
                }
            },
            { new: true }
            )
            
            return handleResponse({
                res,
                msg:`Post has been disliked by ${req.user.fullname}`
                
            })
        }
    } catch (error) {
        logger.error(error.message)
        next(error)
    }
}
const addCommentController = async(req, res, next)=>{
       try{
            const { id } = req.params
            const commentObj = {
                text:req.body.text,
                commentedBy:req.user._id
            }
            
            const post = await Post.findById(id)
            .populate('comments.commentedBy', '_id fullname')
            .populate('postedBy', 'fullname')
            if(!post) throw new ErrorHandler(404, 'Post not found')
            await Post.updateOne({_id: id},
                {
                    $push:
                    {
                         comments:commentObj
                        }
                    },
                     {
                          new:true 
                        }
                    )
            
            return handleResponse({
                res,
                msg:`${req.user.fullname} commented on ${post.postedBy.fullname}'s post`,
                data:post
            })
            
       }catch(error){
           logger.error(error)
           next(error)
       }
}

const deleteCommentController = async(req, res, next)=>{
    logger.info('Inside deleteComment Controller')
    try {
        const { id, commentId } = req.params
        const data = await Post.findOne({_id:id})
        let findComments = data.comments.filter(x=> 
            x.commentedBy.toString() === req.user._id.toString()
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
        const { id, commentId } = req.params
        const post = await Post.findOne({_id:id})
        let like =   post.comments.find(x=>
            x._id.toString() === commentId.toString()
        )?.likes
        if(typeof like !== "undefined"){

            if(!like.includes(req.user._id)){
                
                const data = await  Post.updateOne({_id: id, "comments._id": commentId},
                    {
                        $push:
                        {"comments.$.likes": req.user._id}
                    });
                return handleResponse({
                    res,
                    msg:`Comment liked by ${req.user.fullname}`,
                    data:data
                })
            } else {
        }
            const data = await Post.updateOne({_id:id, 'comments._id': commentId},
            {
                $pull:{ 'comments.$.likes': req.user._id}
            })
            return handleResponse({
                res,
                msg:`Comment disliked by${req.user.fullname}`,
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
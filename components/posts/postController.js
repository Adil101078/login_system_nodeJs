import {
    createService,
     getAllPostsService,
     getPostByIdService,
     updateService,
     deleteService
    } from './postService.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'

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
           userId: req.body.userId
       }
       const updatePost = await updateService(id, updateObj )
        return handleResponse({
            res,
            msg:'Post updated successfully',
            ...updatePost
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const createPost =async (req, res, next) => {
    logger.info('Inside createPost Controller')
    try {
        const {name, description, userId} = req.body
        const postObj = { name, description, userId}
        const data = await createService(postObj)
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
        const data = await deleteService(req.params.id)
        if(!data)
            throw new ErrorHandler(400, 'No record found')
        return handleResponse({
            res,
            data,
            msg:'Post deleted successfully'
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
const likePostController = async (req, res, next) => {
    logger.info('Inside likePost Controller')
    try {
        const {id} = req.params
        const findPost = await getPostByIdService(id)
        console.log(findPost)
        if(!findPost) throw new ErrorHandler(404, 'Post not found')
        findPost.likes_count += 1
        await findPost.save()
        return handleResponse({
            res,
            msg:'Post liked',
            data:findPost.likes_count
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
const commentController = async(req, res, next)=>{
       try{
            const { id } = req.params
            const findPost = await Post.getPostByIdService(id)
            if(!findPost) throw new ErrorHandler(404, 'Post not found')
            
       }catch(error){
           logger.error(error)
           next(error)
       }
}

export { 
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePostController

    }
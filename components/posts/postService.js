import Post from './postModel.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler } from '../../helpers/globalHandler.js'


const createService = async(postObj, next)=>{
    logger.info('Inside createPost Service')
    try {
        const data = await Post.create(postObj)
        return data
        
    } catch (error) {
        logger.error(error)
        next(error)
    }

}
const getAllPostsService = async(next)=>{
    logger.info('Inside getAllPost Service')
    try {
        const result = await Post.find().populate({ 
            path: 'userId',
            select:'fullname'
        }).populate({
            path:'comments',
            select:'_id'
        })
        if(!result)
            throw new ErrorHandler(404, 'No records found')
        return result
        
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getPostByIdService = async(id)=>{
    logger.info('Inside getPostById Service')
    try{
        const result = await Post.findById(id).populate({
            path: 'userId',
            select:'fullname'
        })
        if(!result)
            throw new ErrorHandler(400, 'Could not find')
        return result

    }catch(error){
        logger.error(error)
        next(error)
    }
}
const deleteService = async(id, next)=>{
    logger.info('Inside deletePost Service')
    try {
        const result = await Post.findByIdAndRemove(id)
        if(!result)
            throw new ErrorHandler(400, 'Could not find')
        return result       
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
const updateService = async(id, obj, next)=>{
    logger.info('Inside updatePost Service')
    try {
        const postDetails = await Post.findByIdAndUpdate(id, obj, {new:true})
        return postDetails
        
    } catch (error) {
        logger.error(error)
        next(error)
    }
}

export {
    createService,
    getAllPostsService,
    getPostByIdService,
    deleteService,
    updateService
}
import Post from './postModel.js';
import mongoose from 'mongoose'


const createService = async(postObj)=>{
    const result = await Post.create(postObj)
    return {data:result}

}
const getAllPostsService = async()=>{
    const result = await Post.find().populate({ path: 'userId', select:'fullname'})
    return {data:result}
}

const getPostByIdService = async(id)=>{
    const result = await Post.findById(id).populate({ path: 'userId', select:'fullname'})
    return {data:result}
}
const deleteService = async(id)=>{
    const result = await Post.findByIdAndRemove(id)
    return {data:result}
}
const updateService = async(id,name, description)=>{
    const postDetails = await Post.findOneAndUpdate(
        {
			_id: mongoose.Types.ObjectId(id),
		},
        	{
			$set: {
				...(name && {
					name,
				}),
				...(description && {
					description,
				})
			},
		},
		{ new: true }
    )
    return postDetails
}
export {
    createService,
    getAllPostsService,
    getPostByIdService,
    deleteService,
    updateService
}
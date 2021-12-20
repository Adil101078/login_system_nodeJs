import {createService, getAllPostsService, getPostByIdService,updateService, deleteService} from './postService.js'


const getAllPosts = async (req, res) => {
    const data = await getAllPostsService()
    return res.json(data)
}

const getPostById = async (req, res) => {
   const data =  await getPostByIdService(req.params.id)
   return res.json(data)
}
const updatePost = async (req, res)=>{
    const {name, description} = req.body
    const {id} = req.params
    const data = await updateService(
        id,
        name,
        description
    )
    return res.json(data)
}

const createPost =async (req, res) => {
   const {name, description, userId} = req.body
   const postObj = { name, description, userId}
   const data = await createService(postObj)
   return res.status(201).json(data)
}


const deletePost = async (req, res) => {
    const data = await deleteService(req.params.id)
    return res.status(201).json(data)
}

export { 
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost

    }
import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePostController
} from "./postController.js";
import verifyToken from "../../auth/jwt.js";

const postRoute = express.Router();

postRoute.get('/allPosts', getAllPosts);
postRoute.get('/:id', getPostById)
postRoute.put('/edit/:id', updatePost);
postRoute.post('/addPost',verifyToken, createPost);
postRoute.delete('/delete/:id', deletePost);
postRoute.patch('/likePost/:id', likePostController);



export default postRoute;
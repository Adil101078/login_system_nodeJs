import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "./postController.js";

const postRoute = express.Router();

postRoute.get('/allPosts', getAllPosts);
postRoute.get('/:id', getPostById)
postRoute.put('/edit/:id', updatePost);
postRoute.post('/addPost', createPost);
postRoute.delete('/delete/:id', deletePost);



export default postRoute;
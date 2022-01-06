import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePostController,
    addCommentController,
    deleteCommentController,
    likeCommentController
} from "./postController.js";
import verifyToken from "../../auth/jwt.js";

const postRoute = express.Router();

postRoute.get('/allPosts', getAllPosts);
postRoute.get('/:id', getPostById)
postRoute.put('/edit/:id', verifyToken, updatePost);
postRoute.post('/addPost',verifyToken, createPost);
postRoute.delete('/delete/:id',verifyToken, deletePost);
postRoute.patch('/:id/likePost', verifyToken, likePostController);
postRoute.put('/:id/comment', verifyToken, addCommentController)
postRoute.put('/:id/:commentId/delete', verifyToken, deleteCommentController)
postRoute.put('/:id/:commentId/likeComment', verifyToken, likeCommentController)



export default postRoute;
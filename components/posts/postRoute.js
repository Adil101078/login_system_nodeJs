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
postRoute.delete('/delete/:postId',verifyToken, deletePost);
postRoute.put('/likeUnlikePost/:postId', verifyToken, likePostController);
postRoute.put('/comment/:postId', verifyToken, addCommentController)
postRoute.put('/comment/delete/:postId/:commentId', verifyToken, deleteCommentController)
postRoute.put('/likeComment/:postId/:commentId', verifyToken, likeCommentController)



export default postRoute;
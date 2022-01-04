import express from 'express'
import { createComment, deleteComment, getAllComments } from './commentController.js'
const commentRoute = express.Router()

commentRoute.post('/:postId', createComment)
commentRoute.delete('/delete/:id', deleteComment)
commentRoute.get('/', getAllComments)

export default commentRoute
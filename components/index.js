import express from 'express'
import route from './users/userRoute.js'
import postRoute from './posts/postRoute.js'
const router = express.Router()


router.use('/user', route)
router.use('/post', postRoute)



export default router
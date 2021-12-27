import express from 'express'
import route from './users/userRoute.js'
import postRoute from './posts/postRoute.js'
import adminRoute from './admin/adminRoute.js'
const router = express.Router()


router.use('/user', route)
router.use('/post', postRoute)
router.use('/admin', adminRoute)



export default router
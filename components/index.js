import express from 'express'
import route from './users/userRoute.js'
import postRoute from './posts/postRoute.js'
import adminRoute from './admin/adminRoute.js'
import itemRoute from './items/itemRoute.js'
const router = express.Router()


router.use('/user', route)
router.use('/post', postRoute)
router.use('/admin', adminRoute)
router.use('/item', itemRoute)



export default router
import {
    createItem,
    getItems,
    deleteItem,
    updateItem
} from './itemController.js'
import { Router } from 'express'
import verifyToken  from '../../auth/jwt.js'

const itemRoute = Router()

itemRoute.post('/addItem', verifyToken, createItem)
itemRoute.get('/allItems', verifyToken, getItems)
itemRoute.delete('/delete/:itemId', verifyToken, deleteItem)
itemRoute.put('/update/:itemId', verifyToken, updateItem)

export default itemRoute
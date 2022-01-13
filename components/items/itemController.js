import { createItemService, getItemsService, updateItemService} from "./itemService.js";
import logger from '../../middlewares/logger.js';
import { ErrorHandler, handleResponse } from "../../helpers/globalHandler.js";
import User from '../users/userModel.js'
import Item from "./itemModel.js";

const createItem = async(req, res, next)=>{
    logger.info('Inside createItem Controller')
    try {
        let vendorId = req.user._id
        const { name, title, desc, price } = req.body 
        const findVendor = await User.findOne({_id: vendorId })
        if(findVendor.role !== 'vendor')
            throw new ErrorHandler(401, 'Only vendor can create item')
        var itemObj = {
            name:name,
            title:title,
            desc:desc,
            price:price,
            createdBy: vendorId,
            // image:req.file.path
        }
        const newItem = await createItemService(itemObj)
        return handleResponse({
            res,
            msg:'Item created',
            data: newItem
        })
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const getItems = async(req, res, next)=>{
    logger.info('Inside getItems Controller')
    try {
        const items = await getItemsService()
        if(items.length === 0)
            throw new ErrorHandler(400, 'No items found')
        return handleResponse({
            res,
            msg:'success',
            data:items
        })
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const deleteItem = async(req, res, next)=>{
    logger.info('Inside deleteItem Controller')
    try {
        let vendorId = req.user._id
        const { itemId } = req.params
        const item = await Item.findById(itemId)
        if(item === null)
            throw new ErrorHandler(400, 'Item not found')
        if(item.createdBy.toString() !== vendorId.toString())
            throw new ErrorHandler(401, 'You can only delete your items')
        
        const deleteItem = await Item.findByIdAndDelete({_id:itemId }, { new: true })
        return handleResponse({
            res,
            msg:'Item deleted',
            data: deleteItem
        })
        
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const updateItem = async(req, res, next)=>{
    logger.info('Inside updateItem Controller')
    try {
        let vendorId = req.user._id
        const { itemId } = req.params
        const { name, title, desc, price } = req.body
        const item = await Item.findById(itemId)
        if(item === null)
            throw new ErrorHandler(400, 'Item not found')
        if(item.createdBy.toString() !== vendorId.toString())
            throw new ErrorHandler(401, 'You can only update your items')
        
        let itemObj = {
                name:name,
                title:title,
                desc:desc,
                price:price,
                // image:req.file.path
            }
        const updatedItem = await updateItemService(itemId, itemObj)
        return handleResponse({
            res,
            msg:'Item updated',
            data: updatedItem
        })
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}
export {
    createItem,
    getItems,
    deleteItem,
    updateItem
}
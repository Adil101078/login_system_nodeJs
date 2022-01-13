import logger from '../../middlewares/logger.js'
import Item from './itemModel.js'
import mongoose from 'mongoose'

const createItemService = async(itemObj, next)=>{
    logger.info('Inside createItem Service')
    try {
        const newItem = await Item.create(itemObj)
        return newItem
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}
const getItemsService = async(next)=>{
    logger.info('Inside getItems Service')
    try {
        const items = await Item.aggregate([
            { $match:{ }}
        ])
        return items
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const getItemByIdService = async(id, next)=>{
    logger.info('Inside getItenById Service')
    try {
        let itemId = mongoose.Types.ObjectId(id)
        const itemDetails = await Item.aggregate([
            { $match:{ _id: itemId }}
        ])
        return itemDetails
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

const updateItemService = async(itemId, itemObj, next)=>{
    logger.info('Inside updateItem Service')
    try {
        const item = await Item.findByIdAndUpdate(itemId, itemObj, { new: true })
        return item
    } catch (err) {
        logger.error(err.message)
        next(err)
    }
}

export {
    createItemService,
    getItemsService,
    updateItemService,
    getItemByIdService
}
import mongoose from 'mongoose'


const itemSchema = new mongoose.Schema({
    name: { type: String, required:true },
    title: { type: String, required: true },
    desc: { type: String },
    image: { type: String,default:'' },
    price: { type: Number, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


})

const Item = mongoose.model('Item', itemSchema)
export default Item
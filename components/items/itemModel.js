import mongoose from 'mongoose'


const itemSchema = new mongoose.Schema({
    name: { type: String, required:true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, default:'' },
    price: { type: Number, required: true },
    sellType: { type: String, enum:['fixedPrice', 'bid']},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    previousOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }},
    { timestamps: true })

const Item = mongoose.model('Item', itemSchema)
export default Item
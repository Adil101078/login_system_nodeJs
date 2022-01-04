import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    name:{ type: String, required:true },
    description:{ type: String, required:true},
    posted_at: {type: Date, default: Date.now()},
    likes_count:{ type: Number, default:null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'postComment'
    }]

});

const Post = mongoose.model('Post', postSchema);

export default Post
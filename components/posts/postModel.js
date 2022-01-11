import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    name:{ type: String, required:true },
    description:{ type: String, required:true},
    posted_at: {type: Date, default: Date.now()},
    likes:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments:[{
      text:String,
      commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
      likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      }]
    }]
   
    
});

const Post = mongoose.model('Post', postSchema);

export default Post
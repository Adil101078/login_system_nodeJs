import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    description: { type: String, required:true },
    postId:{ type: mongoose.Schema.Types.ObjectId,
            ref:'Post'
    },
    userId:{ type: mongoose.Schema.Types.ObjectId,
            ref:'User'
    }
    
});

const postComment = mongoose.model('postComment', commentSchema);

export default postComment
import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    name:{ type: String, required:true },
    description:{ type: String, required:true},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }

});

const Post = mongoose.model('Post', postSchema);

export default Post
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    username:{ type: String },
    email:{type: String },
    fullname:{type: String },
    password:{type: String },
    image:{type: String},
    posts:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});
userSchema.methods.verifyPassword = function (password) {
     return bcrypt.compareSync(password, this.password);
    };
    
userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id}, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXP });
    }

const User = mongoose.model('User', userSchema);

export default User;
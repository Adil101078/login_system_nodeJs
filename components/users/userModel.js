import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    username:{ type: String },
    email:{type: String, required: true},
    fullname:{type: String },
    password:{type: String, required: true},
    image:{type: String, default:null},
    emailToken:{type:String},
    isVerified:{type: Boolean, default:false},
    status:{type: String, default: 'active'},
    role:{ type: String, default:'user', enum: ["admin", "user", "vendor"]},
    phoneNumber: {type: String },
    otp: {type: Number, default:null},
    resetToken:{ type: String, default:''},
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      }],
    followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      }],
    followersCount:{ type:Number, default:0},
    followingsCount:{ type: Number, default:0}
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
});
userSchema.methods.verifyPassword = async function (candidatePassword, userPassword) {
     return await bcrypt.compare(candidatePassword, userPassword);

    };
    
userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id}, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXP });
    }

const User = mongoose.model('User', userSchema);

export default User;
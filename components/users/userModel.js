import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
	username: { type: String },
	email: { type: String, required: true, unique: true, lowercase: true },
	fullname: { type: String },
	password: { type: String, required: true, select: false },
	passwordChangedAt: { type: Date },
	image: { type: String, default: null },
	emailToken: { type: String },
	isVerified: { type: Boolean, default: false },
	status: {
		type: String,
		enum: ['pending', 'active', 'rejected', 'inActive'],
		default: 'pending'
	},
	role: {
		type: String,
		enum: ['admin', 'user', 'vendor'],
		default: 'user'
	},
	vendorPusrpose: {
		type: String,
		enum: ['sell']
	},
	phoneNumber: { type: String },
	otp: { type: Number, default: null },
	resetToken: { type: String, default: null },
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	followings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	followersCount: { type: Number, default: 0 },
	followingsCount: { type: Number, default: 0 },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next()
})
userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew ) return next()
	this.passwordChangedAt = Date.now()
	next()
})
userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
	return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.generateJwt = function () {
	return jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
		expiresIn: process.env.JWT_EXP,
	})
}

const User = mongoose.model('User', userSchema)

export default User

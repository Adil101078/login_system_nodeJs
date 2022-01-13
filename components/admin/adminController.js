import User from '../users/userModel.js'
import logger from '../../middlewares/logger.js'
import { ErrorHandler, handleResponse } from '../../helpers/globalHandler.js'
import { sendOtp, verifyOtp, sendOTP } from '../../utils/sendOtp.js'
import { vendorRejectEmail, vendorAcceptEmail } from '../../utils/mailer.js'
import {
	getAllUsersService,
	deleteUserService,
	fetchByIdService,
	updateUserService,
} from './adminServcie.js'

const getAllUsers = async (req, res, next) => {
	logger.info('Inside getAllUser adminControllers')
	try {
		const data = await getAllUsersService()
		// res.render('layouts/main', { data })
		return handleResponse({
			res,
			data
		})
	} catch (error) {
		logger.error(error.message)
		next(error)
	}
}

const getUserById = async (req, res, next) => {
	logger.info('Inside getUserById adminController')
	try {
		let loggedInUser = req.user._id
		const { userId } = req.params
		const isAdmin = await User.aggregate([
			{ $match: { _id: loggedInUser }}
		])
		if (isAdmin.map(x=>x.role).toString() !== 'admin')
			throw new ErrorHandler(401, 'Access denied')

		const user = await fetchByIdService(userId)
		if (!user)
			throw new ErrorHandler(404, 'User not found')
		return handleResponse({
			res,
			msg: 'Success',
			data:user,
		})
	} catch (error) {
		logger.error(error.message)
		next(error)
	}
}

const updateUser = async (req, res, next) => {
	logger.info('Inside updateUser adminController')
	try {
		let loggedInUser = req.user._id
		const { userId } = req.params
		const { username, fullname, email, status, phoneNumber, isVerified, role } = req.body
		const isAdmin = await User.aggregate([
			{ $match:{ _id: loggedInUser }}
		])

		if (isAdmin.map( x=> x.role ).toString() !== 'admin')
			throw new ErrorHandler(401, 'Access denied')
		
		let userObj = {
			username,
			fullname,
			email,
			status,
			phoneNumber,
			isVerified,
			role
		}

		const user = await updateUserService(userId, userObj)
		if (!user) throw new ErrorHandler(404, 'User not found')
		return handleResponse({
			res,
			msg: 'User updated successfully',
			data:user
		})
	} catch (error) {
		logger.error(error)
		throw new Error(error.message)
	}
}

const deleteUser = async (req, res, next) => {
	logger.info('Inside deleteUser adminControllers')
	try {
		let loggedInUser = req.user._id
		const { userId } = req.params
		const isAdmin = await User.findById({ _id: loggedInUser })

		if (isAdmin.role !== 'admin')
			throw new ErrorHandler(401, 'Access denied')
		const user = await deleteUserService(userId)
		return handleResponse({
			res,
			msg:'User deleted',
			data: user })
	} catch (error) {
		logger.error(error.message)
		next(error)
	}
}

const disableUser = async (req, res, next) => {
	logger.info('Inside disable adminControllers')
	try {
		let loggedInUser = req.user._id
		const { email } = req.body
		const isAdmin = await User.findById({ _id: loggedInUser })
		const user = await User.findOne({ email })
		if (isAdmin.role !== 'admin')
			throw new ErrorHandler(401, 'Access denied')

		if(!user || user === null)
			throw new ErrorHandler(404, 'User not found')

		const disableUser = await User.findByIdAndUpdate(
			{_id: user._id},
			{ $set:{ status: 'inActive', isVerified: false }},
			{ new: true }
			)
		
		return handleResponse({
			res,
			msg:'User has been disabled',
			data: disableUser
		})
	} catch (error) {
		logger.error(error)
		next(error)
	}
}

const enableUser = async (req, res, next) => {
	logger.info('Inside enableUser adminControllers')
	try {
		let loggedInUser = req.user
		const { email } = req.body
		const isAdmin = await User.findById({ _id: loggedInUser._id })
		const user = await User.findOne({ email })
		if (isAdmin.role !== 'admin')
			throw new ErrorHandler(401, 'Access denied')
		if(!user || user === null)
			throw new ErrorHandler(404, 'User not found')
		const enableUser = await User.findByIdAndUpdate(
			{_id: user._id},
			{ $set:{ status: 'active', isVerified: true }},
			{ new: true }
			)
		
		return handleResponse({
			res,
			msg:'User has been enabled',
			data: enableUser
		})
	} catch (error) {
		logger.error(error.message)
		next(error)
	}
}

const login = async (req, res, next) => {
	logger.info('Inside adminLogin Controller')
	try {
		const { email, password } = req.body
		if (!email || !password) {
			throw new ErrorHandler(404, 'Please provide email and password')
		}
		const user = await User.findOne({ email }).select('+password')

		if (!user || !(await user.correctPassword(password, user.password))) {
			throw new ErrorHandler(400, 'Incorrect email or password')
		}
		if (user.role !== 'admin')
			throw new ErrorHandler(404, 'User must be an admin')

		const phone = user.phoneNumber
		let otp = Math.floor(10000 + Math.random() * 90000)
		// sendOtp(phone)
		await sendOTP(otp, phone)
		user.otp = otp
		await user.save()
		return handleResponse({
			res,
			msg: 'OTP sent to registered Mobile Number',
			data: user._id,
		})
	} catch (error) {
		logger.error(error.message)
		next(error)
	}
}
const verifyLogin = async (req, res, next) => {
	try {
		const { otp } = req.body
		const user = await User.findOne({ otp })
		if (user.otp === otp) {
			const updateUser = await User.findByIdAndUpdate(
				{ _id: user._id },
				{ $set: { otp: null }},
				{ new: true }
			)
			const token = user.generateJwt()
			return handleResponse({
				res,
				data: updateUser,
				token: token,
				msg: 'OTP verified successfully',
			})
		} else {
			throw new ErrorHandler(403, 'Invalid OTP')
		}
		//    const { otp, phone } = req.body
		//    let data = await verifyOtp(otp, phone)
		//    if(data.status === 'approved'){
		//        return handleResponse({
		//            res,
		//            msg:'OTP verified successfully',
		//            data
		//        })}else{
		//             throw new ErrorHandler(400, 'OTP not verified. Please enter correct OTP')}
	} catch (error) {
		logger.error(error.message)
		if ((error.status === 404) & (error.code === 20404)) {
			throw new ErrorHandler('OTP is expired')
		}
		next(error)
	}
}

const acceptVendorApproval = async (req, res, next) => {
	logger.info('Inside vendorApproval COntroller')
	try {
		const { vendorId } = req.params
		const { host } = req.headers
		const updateVendor = await User.findByIdAndUpdate(
			{ _id: vendorId },
			{ $set: { status: 'approved', isVerified: true, role: 'vendor' } },
			{ new: true }
		)
		let emailData = {
			reciever: updateVendor.email,
			sender: process.env.SENDER_EMAIL,
			host: host,
			fullname: updateVendor.fullname,
			email: updateVendor.email,
		}
		vendorAcceptEmail(emailData)

		return handleResponse({
			res,
			msg: 'Vendor application has been approved',
			data: updateVendor,
		})
	} catch (err) {
		logger.error(err.message)
		next(err)
	}
}
const rejectVendorApproval = async (req, res, next) => {
	logger.info('Inside rejectVendorApproval Controller')
	try {
		const { vendorId } = req.params
		const { host } = req.headers
		const updateVendor = await User.findByIdAndUpdate(
			{ _id: vendorId },
			{ $set: { status: 'rejected', role: 'user' } },
			{ new: true }
		)
		let emailData = {
			reciever: updateVendor.email,
			sender: process.env.SENDER_EMAIL,
			host: host,
			fullname: updateVendor.fullname,
		}
		vendorRejectEmail(emailData)

		return handleResponse({
			res,
			msg: 'Vendor application has been rejected',
			data: updateVendor,
		})
	} catch (err) {
		logger.error(err.message)
		next(err)
	}
}

const updateUserPassword = async(req, res, next)=>{
	logger.info('Inside updatePassword Controller')
	try {
		let loggedInUser = req.user
    	const { userId } = req.params
    	const { newPassword } = req.body
    	const user = await User.findById({ _id: userId }).select('+password')
    	if(!user)
      		throw new ErrorHandler(401, 'User not found')
   		if( loggedInUser.role !== 'admin')
		   	throw new ErrorHandler(401, 'Unauthorized access')
    	user.password = newPassword
     	await user.save()
     	return handleResponse({
       res,
       msg:'Password changed succesfully',
	   data: user
     })
	} catch (err) {
		logger.error(err.message)
		next(err)
	}
}
export {
	getAllUsers,
	deleteUser,
	disableUser,
	enableUser,
	login,
	verifyLogin,
	updateUser,
	getUserById,
	rejectVendorApproval,
	acceptVendorApproval,
	updateUserPassword
}

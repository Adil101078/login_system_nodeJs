import dotenv from 'dotenv'
import Twilio from 'twilio'
import logger from '../middlewares/logger.js'
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = new Twilio(accountSid, authToken)


 const sendOtp = async (phone)=>{
    try{
        client.verify.services(process.env.TWILIO_VERIFY_SERVICE)
			.verifications.create({
				to: phone,
				channel: 'sms',
			})
			.then((data) => {
				return res.json({
					status: true,
					msg: 'OTP Sent Successfully',
				})
			})
    }catch(error){
        return error
    }
}
const verifyOtp = async (otp, phone) => {
     try{
        return await client.verify.services(process.env.TWILIO_VERIFY_SERVICE)
                .verificationChecks.create({
                    to: phone,
                    code: otp
               })
                

        }catch(error) {
        logger.error(error)
        return error
    }
}
    


export {
    sendOtp,
    verifyOtp
}

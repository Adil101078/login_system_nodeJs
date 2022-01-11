import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


function sendEmail(emailData){
   const msg = {
       to:emailData.reciever,
       from: emailData.sender,
       subject: 'verify your account',
       text:`
            Hello , thanks for registering.
            Please copy and paste the link to verify your account.
            http://${emailData.host}/verify-email?token=${emailData.emailToken}
           `,
       html:`
            <h1>Hello</h1>
            <p> Please click the link to verify your account</p>
            <a href="https://${emailData.host}/api/v1/user/verify-email?token=${emailData.emailToken}"> Verify your account</a>
            `

   }
   sgMail
   .send(msg)
   .then(() => {
     console.log(`Email sent to ${emailData.email}`)
   })
   .catch((error) => {
     console.error(error)
   })
}
function forgotPasswordLink(emailData){
   const msg = {
       to:emailData.reciever,
       from: emailData.sender,
       subject: 'Reset your Password',
       text:`
            Hello ${emailData.fullname}
            Please click the link below to change your password.
            http://${emailData.host}/api/v1/user/reset-password/${emailData.userId}/${emailData.resetToken}
           `,
       html:`
            <h1>Hello ${emailData.fullname}</h1>
            <p> Please click the link below to change your password</p>
            <a href="https://${emailData.host}/api/v1/user/reset-password/${emailData.userId}/${emailData.resetToken}"> Change Password</a>
            `

          }
          
   sgMail
   .send(msg)
   .then(() => {
     console.log(`Email sent to ${emailData.email}`)
   })
   .catch((error) => {
     console.error(error)
   })
}
export {
  sendEmail,
  forgotPasswordLink
}

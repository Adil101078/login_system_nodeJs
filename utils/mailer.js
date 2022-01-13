import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'
import logger from '../middlewares/logger.js'

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
            http://${emailData.host}/api/v1/user/verifyEmail?userId=${emailData.userId}&token=${emailData.emailToken}
           `,
       html:`
            <h1>Hello, ${emailData.fullname}, thanks for registering</h1>
            <p> Please click the link to verify your account</p>
            <a href="https://${emailData.host}/api/v1/user/verifyEmail?userId=${emailData.userId}&token=${emailData.emailToken}"> Verify your account</a>
            `

   }
   sgMail
   .send(msg)
   .then(() => {
     logger.info(`Email sent to ${emailData.email}`)
   })
   .catch((error) => {
     logger.error(error.message)
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
            http://${emailData.host}/api/v1/user/verifyPassword/${emailData.userId}/${emailData.resetToken}
           `,
       html:`
            <h1>Hello ${emailData.fullname}</h1>
            <p> Please click the link below to change your password</p>
            <a href="https://${emailData.host}/api/v1/user/verifyPassword/${emailData.userId}/${emailData.resetToken}"> Change Password</a>`

          }
          
   sgMail
   .send(msg)
   .then(() => {
     logger.info(`Email sent to ${emailData.email}`)
   })
   .catch((error) => {
     logger.error(error.message)
   })
}

function sendEmailToAdmin(emailData){
  logger.info('Inside sendEmailToAdmin Function')
  
    const msg = {
      to:emailData.reciever,
      from: emailData.sender,
      subject: 'Approval for vendor',
      text: `
      Hello, ${emailData.fullname}
      A vendor with ${emailData.vendorEmail} is waiting for your approval. Please go through his application and make a decision.
      `,
      html:`
      <h1>Hello, ${emailData.fullname}</h1>
      <h3>Vendor Details</h3>
      <p>Name: ${emailData.vendorName}</p>
      <p>Email: ${emailData.vendorEmail}</p>
      <p>Purpose: ${emailData.vendorPurpose}</p>
      <p>Phone: ${emailData.phone}</p>
      `
    }
    sgMail.send(msg)
    .then(() => logger.info('Email has been sent to the administration'))
    .catch((err) => {
     logger.error(err.message)
    })
 
}

function vendorAcceptEmail(emailData){
  const msg = {
      to:emailData.reciever,
      from: emailData.sender,
      subject: 'Vendor application status',
      text:`
           Hello ,${emailData.fullname} thanks for registering.
          
          `,
      html:`
           <h1>Hello, ${emailData.fullname}</h1>
           <p> Your application has been accepted. Please login using your email Id & password created at signup process</p>
           <a href="https://${emailData.host}/api/v1/user/vendor/login">Click to login</a>
           `

  }
  sgMail
  .send(msg)
  .then(() => {
    logger.info(`Email sent to ${emailData.email}`)
  })
  .catch((error) => {
    logger.error(error.message)
  })
}
function vendorRejectEmail(emailData){
  const msg = {
      to:emailData.reciever,
      from: emailData.sender,
      subject: 'Vendor application status',
      text:`
           Hello ${emailData.fullname}, thank you for your interest in working with us. Unfortunately, at this time the team has decided not to advance your application to the next step for the Vendor Role.

          
          `,
      html:`
           <h1>Hello, ${emailData.fullname}</h1>
           <p> Thank you for your interest in working with us. Unfortunately, at this time the team has decided not to advance your application to the next step for the Vendor Role.</p>
         
           `

  }
  sgMail
  .send(msg)
  .then(() => {
    logger.info(`Email sent to ${emailData.email}`)
  })
  .catch((error) => {
    logger.error(error.message)
  })
}
export {
  sendEmail,
  forgotPasswordLink,
  sendEmailToAdmin,
  vendorAcceptEmail,
  vendorRejectEmail
}

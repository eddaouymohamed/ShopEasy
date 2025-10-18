// // import nodemailer from 'nodemailer';
// // // const smtpService=process.env.SMTP_SERVICE || 'gmail';
// // const smtpUser=process.env.SMTP_USER ;
// // const smtpPassword=process.env.SMTP_PASSWORD;
// // export const sendMail= async(options)=>{
// //     /// verify smpt User and smtp password
// //  console.log('SMTP_USER:', process.env.SMTP_USER);
// //     console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD); challeoons
// // console.log('hello javascript donc on  ne peut pas de plus etre comme vous voyeys doc')

// //     if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
// //         throw new Error('SMTP_USER or SMTP_PASSWORD is missing in environment variables');
// //     }

// //     /// transporter creating
// //     const transporter=nodemailer.createTransport({
// //         // service:smtpService,
// //          host: 'smtp.gmail.com',
// //         port: 465,
// //         secure: true, // SSL,
// //         auth:{
// //             user:smtpUser,
// //             pass:smtpPassword
// //         }
// //         ,
// //         tls:{
// //             rejectUnauthorized: false
// //         }
// //     })
// //     // verify connection configuring optional but helpful
// // try {
// //     await transporter.verify();
// //     console.log('smtp server is ready to send messages')
// // } catch (error) {
// //     console.error('Error verifying SMTP connection:', error);
// //     throw new Error('Smtp connection failed: ' + error.message)
// // }

// //     /// prepairng mail Options
// //     const mailOptions={
// //         from:smtpUser,
// //         to:options.email,
// //         subject:options.subject,
// //         text:options. resetPasswordMsg || options. orderSuccessMessage
// //     }

// //     // await transporter.sendMail(mailOptions)
// //     // send mail
// //     try {
// //         const info=await transporter.sendMail(mailOptions)
// //         console.log(`email sent :${info.response}`);
// //         return info ;
// //     }
// //     catch (error) {
// //         console.error('Error sending mail: '+error);
// //         throw new Error('falied to send email to :'+mailOptions.email)
// // }
// // }

// // // confirm
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// // ✅ Load environment variables early
// dotenv.config({ path: 'backend/config/config.env' });

// const smtpUser = process.env.SMTP_USER;
// const smtpPassword = process.env.SMTP_PASSWORD;

// export const sendMail = async (options) => {
//   // Debug logs to confirm env is loaded
//   console.log("=== SMTP CONFIG CHECK ===");
//   console.log("SMTP_USER:", smtpUser || "❌ MISSING");
//   console.log("SMTP_PASSWORD:", smtpPassword ? "***HIDDEN***" : "❌ MISSING");
//   console.log("==========================");

//   if (!smtpUser || !smtpPassword) {
//     throw new Error("SMTP_USER or SMTP_PASSWORD is missing in environment variables");
//   }

//   // Create transporter
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // SSL
//     auth: {
//       user: smtpUser,
//       pass: smtpPassword,
//     },
//     tls: {
//       rejectUnauthorized: false, // ⚠️ dev only
//     },
//   });

//   // Verify connection
//   try {
//     await transporter.verify();
//     console.log("✅ SMTP server is ready to send messages");
//   } catch (error) {
//     console.error("❌ Error verifying SMTP connection:", error);
//     throw new Error("SMTP connection failed: " + error.message);
//   }

//   // Mail options
//   const mailOptions = {
//     from: smtpUser,
//     to: options.email,
//     subject: options.subject,
//     text: options.resetPasswordMsg || options.orderSuccessMessage,
//   };

//   // Send email
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent successfully: ${info.response}`);
//     console.log('Email sent successfully to:', mailOptions.to);
//     return info;
//   } catch (error) {
//     console.error("❌ Error sending mail:", error);
//     throw new Error("Failed to send email to: " + mailOptions.to);
//   }
// };
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
if(process.env.NODE_ENV!=='PRODUCTION'){
dotenv.config({ path: 'backend/config/config.env' })
}

// const smtpService = process.env.SMTP_SERVICE || 'gmail';
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
export const sendMail = async (options) => {
  // debug logs to confirm env is loaded
  console.log('!!!!!smtp Conifg Check$$$$$$$$');
  console.log(`SMTP USER: ${smtpUser ? smtpUser : '***Misssing***'}`);
  console.log(`SMTP PASSWORD: ${smtpPassword ? '****Hidden****' : '****Missing****'}`);
  console.log('**************************************************')
  /// verfiy user and password smtp service
  if (!smtpPassword || !smtpUser) {
    throw new Error('SMTP Password or User are Missing in Environment Varibales ');
  }
  /// create transporter

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, //SSL,u
    auth: {
      user: smtpUser,
      pass: smtpPassword
    },
    tls: {
      rejectUnauthorized: false // dev only
    }
  })
  try {
    await transporter.verify();
    console.log('smtp server is ready to send messages');
  } catch (error) {
    console.error('Error verifing SMTP Connection:', error);
    throw new Error('Smtp Connection Failed: ' + error.message);
  }
  // praparing mail options
  const mailOptions = {
    from: smtpUser,
    to: options.email,
    subject: options.subject,
    text: options.resetPasswordMsg || options.orderSuccessMessage

  }
  // send mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('infor are:', info);
    console.log(`email sent successfully: ${info.response}`);
    console.log('email sent successfully toi:', mailOptions.to)

  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

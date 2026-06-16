import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail=async (to,subject,html)=>{
    await transporter.sendMail({
        from:`${process.env.SMTP_FROM_EMAIL}`,
        to,
        subject,
        html
    })
}

const sendVerificationEmail=(email,token)=>{
    await transporter.sendMail({
        from:`${process.env.SMTP_FROM_EMAIL}`,
        email,
        subject,
        html
    })
}

export {sendMail,sendVerificationEmail}
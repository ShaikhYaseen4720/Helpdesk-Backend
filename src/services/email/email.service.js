import nodemailer from "nodemailer";
import {env} from "../../config/env.js"

const transporter = nodemailer.createTransport({
    host : env.email.host, 
    port : env.email.port, 
    secure : true, 
    auth : {
        user : env.email.user, 
        pass : env.email.password
    }
})

const sendEmail = async ({to, subject, text, html}) => {
    await transporter.sendMail({
        from : env.email.from, 
        to : to, 
        subject : subject, 
        text : text, 
        html : html
    })
}

const sendVerficationEmail = async ({to, verificationToken}) => {
    const verificationLink = `http://localhost:3000/verify-user?token=${verificationToken}`

    await sendEmail({
        to, 
        subject : "Verify your Helpdesk account", 
        text : `Please verify your account using link: ${verificationLink}`,
        html : `
        <h2>Verify you helpdesk account</h2>
        <p>Thanks for registration.</p>

        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">
            Verify Email
        </a>
        <p>This link will expire soon.</p>
        `
    })
}

export {
    sendEmail, 
    sendVerficationEmail
}

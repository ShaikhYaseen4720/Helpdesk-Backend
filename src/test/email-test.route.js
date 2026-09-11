import express from "express"
import  {sendEmail, sendVerficationEmail} from "../services/email/email.service.js"
import { env } from "../config/env.js"

const router = express.Router()

router.get("/send-mail", async (req, res, next) => {
    try {
        await sendEmail({
            to : env.email.user, 
            subject : "Helpdesk email Test", 
            text : "This is a test email from Helpdesk backend"
        })

        res.json({
            success : true, 
            message : "Test email sent successfully"
        })
    } catch (error) {
        next(error)
    }
})

router.get("/send-verification-email-test",  async(req, res, next) => {
    try {
        await sendVerficationEmail({
            to : env.email.user, 
            verificationToken : "test-token-123"
        })

        res.json({
            success : true, 
            message : "Verfication email sent successfully"
        })
    } catch (error) {
        next(error)
    }
})

export default router
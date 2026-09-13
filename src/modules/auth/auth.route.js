import express from "express"
import { asyncHandlerWrapper } from "../../wrapper/async-handeler.js"
import { registerSchema, loginSchema } from "./auth.schema.js"
import { validate } from "../../middleware/validate.middleware.js"
import * as authController from "./auth.controller.js"

const router = express.Router()

router.post("/sign-up", 
        validate(registerSchema), 
        asyncHandlerWrapper(authController.signUp)
    )

router.get("/verify-user", 
        asyncHandlerWrapper(authController.verifyUser)
)

router.post("/sign-in", 
        validate(loginSchema), 
        asyncHandlerWrapper(authController.signIn)
)

router.post("/refresh-token", 
        asyncHandlerWrapper(authController.refreshToken)
)

router.post("/sign-out",
        asyncHandlerWrapper(authController.signOut))


export default router
import express from "express"
import { globalErrorHandler } from "./middleware/GLB-Errorhandling.js"
import authRouter from "./modules/auth/auth.route.js"

const app = express()
//global middleware
app.use(express.json())

//app routes
app.use("/auth", authRouter)

//error handeler
app.use(globalErrorHandler)

export {
    app
}
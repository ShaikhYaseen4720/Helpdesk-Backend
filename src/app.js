import express from "express"
import { globalErrorHandler } from "./middleware/GLB-Errorhandling"

const app = express()



app.use(globalErrorHandler)

export {
    app
}
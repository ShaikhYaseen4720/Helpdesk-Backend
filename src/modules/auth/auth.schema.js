import { z } from "zod"

const registerSchema = z.object({
    name : z.string().trim()
            .min(3, "Name should be of minimum 2 characters")
            .max(50, "Name can be maximum of 50 charcters"), 

    email : z.email("Invalid email").trim().toLowerCase(), 

    password : z.string()
            .min(8, "Password must contain minimum of 8 characters")
            .max(64, "Password should exceed more then 64 characters"), 

    phoneNumber : z.string()
            .regex(/^\d{10}$/, "Invalid number")
})


const loginSchema = z.object({
    email : z.email("Invalid Email")
            .trim().toLowerCase(), 

    password : z.string()
            .min(1, "Password is required")
})


export {
    registerSchema, loginSchema
}
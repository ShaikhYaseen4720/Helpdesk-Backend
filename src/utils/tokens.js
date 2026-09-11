import crypto from "crypto"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { generateJTI } from "./ids.js"

const hashCryptoToken = (token) => {
    let tokenHash = crypto
                    .createHash('SHA256')
                    .update(token)
                    .digest("hex")

    return {token , tokenHash}
}

const generateVerificationToken = () => {
    let token = crypto.randomBytes(32).toString("hex")

    return hashCryptoToken(token)
}

const generateSignInTokens = (user) => {
    const jti = generateJTI()

    let accessToken = jwt.sign(
        {
            sub : user.id, 
            role : user.role
        }, 
        env.jwtSecret, 
        {
            expiresIn : "15m"
        }
    )

    let refreshToken = jwt.sign(
        {
            sub : user.id, 
            jti : jti
        },
        env.jwtSecret, 
        {
            expiresIn : "1w"
        }
    )

    return {accessToken, refreshToken, jti}
}


export {
    generateVerificationToken, hashCryptoToken, 
    generateSignInTokens
}
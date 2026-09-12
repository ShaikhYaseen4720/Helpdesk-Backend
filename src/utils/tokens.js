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

const generateSignInTokens = ({userId, role}) => {
    const jti = generateJTI()

    let accessToken = jwt.sign(
        {
            sub : userId, 
            role : role
        }, 
        env.jwtSecret, 
        {
            expiresIn : "15m"
        }
    )

    let refreshToken = jwt.sign(
        {
            sub : userId, 
            jti : jti
        },
        env.jwtSecret, 
        {
            expiresIn : "1w"
        }
    )

    return {accessToken, refreshToken, jti}
}

const verifyJWTtoken = (token) => {
    let claim = jwt.verify(token, env.jwtSecret)
    return claim
}


export {
    generateVerificationToken, hashCryptoToken, 
    generateSignInTokens, verifyJWTtoken
}
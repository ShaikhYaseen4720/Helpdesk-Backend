import * as authRepository from "./auth.repository.js"
import { AuthenticationError, validationError } from "../../errors/custom-error.js"
import * as tokenUtil from "../../utils/tokens.js"
import { sendVerficationEmail, AlertMail } from "../../services/email/email.service.js"
import { hashPassword, comparePassword } from "../../utils/hash-password.js"
import { generateFamilyID } from "../../utils/ids.js"
import { appConfig } from "../../config/app-config.js"

const signUp = async(data) => {
    let response = {success : true, message : "is registerion is valid. Email has been sent to registered email."}

    let user = await authRepository.findByEmail(data.email)
    if(user){
        console.log(user.email, "already exists")
        return response
    }

    const passwordHash = await hashPassword(data.password)

    let newUser = await  authRepository.createUser({
        name : data.name, 
        password : passwordHash, 
        email : data.email, 
        phoneNumber : data.phoneNumber
    })

    let {token, tokenHash} =  tokenUtil.generateVerificationToken()
    console.log("Token :", token)
    let tokenExpr = new Date(Date.now() + 1000 * 60 * 15)
    
    let authPromise = authRepository.storeVerificationToken({
        userId : newUser.id, 
        tokenHash : tokenHash, 
        expires : tokenExpr
     })

     let emailPromise = sendVerficationEmail({
        to : newUser.email, verificationToken : token
     })
     
     await Promise.all([authPromise, emailPromise])
     console.log('Email sent successfully to ', newUser.email)

     return response
}

const verifyToken = async (token) => {
    let {tokenHash} = tokenUtil.hashCryptoToken(token)
    
    let tokenRec = await authRepository.findToken(tokenHash)
    if(!tokenRec){
        throw new validationError("Verification Invalid")
    }

    if(Date.now() > tokenRec.expires){
        throw new validationError("Verification Invalid")
    }

    if(tokenRec.usedAt){
        throw new validationError("Verification Invalid")
    }

    let userUpdate = authRepository.markUserAsValid(tokenRec.userId)
    let tokenUpdate = authRepository.markTokenAsUsed(tokenHash, new Date(Date.now()))

    Promise.all([userUpdate, tokenUpdate])
}

const signIn = async (email, password) => {
    let user = await authRepository.findByEmail(email)
    if(!user){
        throw new AuthenticationError()
    }

    let isValid = await comparePassword(password, user.password)
    if(!isValid){
        throw new AuthenticationError()
    }

    if(!user.verified){
        throw new AuthenticationError()
    }

    let familyId = generateFamilyID()

    let {accessToken, refreshToken, jti} = tokenUtil.generateSignInTokens({
        id : user.id, 
        role : user.role
    })

    let {tokenHash} = tokenUtil.hashCryptoToken(refreshToken)

    let payload = {
        jti : jti, 
        userId : user.id,
        familyId : familyId, 
        tokenHash : tokenHash,
        expires : appConfig.jwt.refreshTokenExpiration
    }

    await authRepository.storeRefreshToken(payload)

    return {accessToken, refreshToken}
}

const tokenRefresh = async (token) => {
    let claim = null

    //signature verification
    try {
        claim = tokenUtil.verifyJWTtoken(token)
    } catch (error) {
        console.log("signature verification failed")
        throw new validationError("Invalid token")
    }

    console.log(claim)
    let tokenRec = await authRepository.getRefreshToken(claim.jti)
    let {tokenHash} = tokenUtil.hashCryptoToken(token)

    // hash comparision
    if(tokenHash !== tokenRec.tokenHash){
        console.log("Hash not matching!!")
        throw new validationError("Invalid Token")
    }

    // expiry check
    if(new Date() > tokenRec.expires){
        console.log("Token is expired")
        throw new validationError("Invalid Token")
    }
    
    //reuse detection
    if(tokenRec.revoke){
        console.log("Suspicious activity detected!!!\nOld refresh token is reused")
        
        let user = await authRepository.findById(tokenRec.userId)
        
        // revoking token family
        await authRepository.revokeTokenFamily(tokenRec.familyId)

        console.log("Sending Alert mail to", user.email)
        await AlertMail(user.email)

        throw new validationError("Invalid Token")
    }
    
    //token rotation
    let user = await authRepository.findById(tokenRec.userId)

    let results = await authRepository.markRTAsUsed(tokenRec.jti)
    if(results.count !== 1){
        throw new validationError("Invalid token")
    }
    
    let {accessToken, refreshToken, jti} = tokenUtil.generateSignInTokens({
        userId : user.id, 
        role : user.role
    });
    
    ({tokenHash} = tokenUtil.hashCryptoToken(refreshToken))

    await authRepository.storeRefreshToken({
        jti : jti, 
        userId : user.id, 
        familyId : tokenRec.familyId, 
        tokenHash : tokenHash,
        expires : appConfig.jwt.refreshTokenExpiration
    })
    
    return {accessToken, refreshToken}
}


export {
    signUp, 
    verifyToken, 
    signIn, 
    tokenRefresh
}
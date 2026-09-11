import * as authRepository from "./auth.repository.js"
import { AuthenticationError, validationError } from "../../errors/custom-error.js"
import * as tokenUtil from "../../utils/tokens.js"
import { sendVerficationEmail } from "../../services/email/email.service.js"
import { hashPassword, comparePassword } from "../../utils/hash-password.js"
import { generateFamilyID } from "../../utils/ids.js"

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
        expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }

    await authRepository.storeRefreshToken(payload)

    return {accessToken, refreshToken}
}

export {
    signUp, 
    verifyToken, 
    signIn
}
import { prisma } from "../../lib/prisma.js"

// Users
const findByEmail = async(email) => {
    return await prisma.user.findUnique({
        where : {
            email : email
        }
    })
}

const createUser = async(data) => {
    return await prisma.user.create({
        data : data
    })
}

const markUserAsValid = async (userId) => {
    await prisma.user.update({
        where : {
            id : userId
        }, 
        data : {
            verified : true   
        }
    })
}

const findById = async(id) => {
    return await prisma.user.findUnique({
        where : {
            id : id
        }
    })
}

// Email verification token
const storeVerificationToken = async ({userId, tokenHash, expires}) => {
    await prisma.emailVerificationToken.create({
        data : {
            userId : userId, 
            tokenHash : tokenHash, 
            expires : expires
        }
    })
}

const findToken = async (tokenHash) => {
    return await prisma.emailVerificationToken.findUnique({
        where  : {
            tokenHash : tokenHash
        }
    })
}

const markTokenAsUsed = async (tokenHash, usedTime) => {
    await prisma.emailVerificationToken.update({
        where : {
            tokenHash : tokenHash
        }, 
        data : {
            usedAt : usedTime
        }
    })
}

// Refresh Token
const storeRefreshToken = async (payload) => {
    await prisma.refreshToken.create({
        data : payload
    })
}

const getRefreshToken = async (jti) => {
    return await prisma.refreshToken.findUnique({
        where : {
            jti : jti
        }
    })
}

const markRTAsUsed = async(jti) => {
    return await prisma.refreshToken.updateMany({
        where : {
            jti : jti,
            revoke : false
        },
        data : {
            revoke : true
        }
    })
}

const revokeTokenFamily = async (familyId) => {
    await prisma.refreshToken.updateMany({
        where : {
            familyId : familyId
        }, 
        data : {
            revoke : true
        }
    })
}

export {
    findByEmail, createUser, markUserAsValid, findById,
    storeVerificationToken, findToken, markTokenAsUsed,
    storeRefreshToken, getRefreshToken, markRTAsUsed, revokeTokenFamily
}
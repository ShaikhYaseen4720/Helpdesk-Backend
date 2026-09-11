import { prisma } from "../../lib/prisma.js"

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

const storeRefreshToken = async (payload) => {
    await prisma.refreshToken.create({
        data : payload
    })
}


export {
    findByEmail, createUser, markUserAsValid,
    storeVerificationToken, findToken, markTokenAsUsed,
    storeRefreshToken
}
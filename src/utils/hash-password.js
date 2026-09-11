import bcrypt from "bcrypt"

const hashPassword = async(password) => {
    return await bcrypt.hash(password, 12)
}

const comparePassword = async(password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash)
}


export {
    hashPassword, 
    comparePassword
}
import crypto from "crypto"

const generateJTI = () => {
    return crypto.randomUUID()
}

const generateFamilyID = () => {
    return crypto.randomUUID()
}


export {
    generateJTI, 
    generateFamilyID
}
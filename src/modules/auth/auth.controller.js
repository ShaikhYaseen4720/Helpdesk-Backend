import * as authService from "./auth.service.js"

const signUp = async (req, res) => {
    const data = req.body
    
    let response = await authService.signUp(data)
    res.status(201).json({
        status : response.status, 
        message : response.message
    })
}

const verifyUser = async (req, res) => {
    const token = req.query.token

    if (!token){
        return res.status(400).json({
            success : false, 
            message : "Verification Invalid"
        })
    }

    await authService.verifyToken(token)

    return res.status(200).json({
        status : true, 
        message : "User verification successful"
    })
}

const signIn = async (req, res) => {
    let {email, password} = req.body

    let tokens = await authService.signIn(email, password)

    return res.json({
        success : true, 
        message : "Sign In successful", 
        tokens : tokens
    })
}

const refreshToken = async (req, res) => {
    let {token} = req.body

    let tokens = await authService.tokenRefresh(token)

    return res.json({
        success : true, 
        message : "Token refresh successful", 
        tokens : tokens
    })
}


export {
    signUp, 
    verifyUser, 
    signIn,
    refreshToken
}
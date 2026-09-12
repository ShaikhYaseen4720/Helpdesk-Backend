const globalErrorHandler = (err, req, res, next) => {
    let serverErroMsg = "Internal server error"
    let statusCode = err.statusCode || 500
    let message = err.message || serverErroMsg
    // if(statusCode === 500){
    //     console.log(err)
    // }
    
    console.log(err)

    return res.status(statusCode).json({
        status : false,
        error : {
            message : statusCode === 500 ? serverErroMsg : message
        }
    })
}


export {
    globalErrorHandler
}
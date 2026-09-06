const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.status || 500
    let message = err.message || "Internal server error"

    if(statusCode === 500){
        console.log(err)
    }

    return res.status(statusCode).json({
        status : false,
        error : {
            message : message
        }
    })
}


export {
    globalErrorHandler
}
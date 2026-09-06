const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if(!result.sucess){
            return res.status(409).json({
                success : false, 
                message : result.message
            })
        }

        req.body = result.data

        next()
    }
}


export {
    validate
}
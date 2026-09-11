import "dotenv/config"

const env = {
    databaseUrl : process.env.DATABASE_URL, 
    port : Number(process.env.PORT), 

    email : {
        host : process.env.EMAIL_HOST, 
        port : Number(process.env.EMAIL_PORT), 
        user : process.env.EMAIL_USER, 
        password : process.env.EMAIL_PASSWORD, 
        from : process.env.EMAIL_FROM
    }, 

    jwtSecret : process.env.JWT_SECRET
}


export {
    env
}
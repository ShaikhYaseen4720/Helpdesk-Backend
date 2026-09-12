const appConfig = {
    jwt : {
        refreshTokenExpiration : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
}


export {
    appConfig
}
import { AppError } from "./app-error.js";

class AuthenticationError extends AppError{
    constructor(message = "Invalid username or password"){
        super(message, 401)
    }
}

class validationError extends AppError{
    constructor(message = "Invalid data"){
        super(message, 409)
    }
}

export {
    AuthenticationError, 
    validationError
}
class ApiError extends Error{
    constructor(status,message) {
        super(message)
        this.statusCode=status
        this.isOperational=true
        Error.captureStackTrace(this,this.constructor)
    }
    static badRequest(message="Bad request"){
        throw new ApiError(401,message)
    }
    static unAuthorized(message="No data"){
        throw new ApiError(400,message)
    }
    static conflict(message ="User already sxist"){
        throw new ApiError(409,message)
        
    }

    static forbidden(message="forbidden"){
        return new ApiError(412,message);
    }

    static notFound(message="forbidden"){
        return new ApiError(413,message)
    }
}

export default ApiError
import ApiError from "../../common/utils/api.error.js"
import { verifyToken } from "../../common/utils/jwt.utils.js";

import User from "./auth.model.js"

const authenticate=async (req,res,next)=>{
    let token;

    if(req.headers.authorization?.startsWith("Bearer"))
        token=req.headers.authorization.split(" ")[1]

    if(!token)
        throw ApiError.unAuthorized("Not authenticated")
    const decoded=verifyToken(token)

    const user=await User.findById(decoded.id)
    if(!user)
       throw ApiError.unAuthorized("User no longer exists")

    req.user={
        id:user._id,
        role:user.role,
        name:user.name,
        email:user.email
    };

    next()
}

const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
            throw ApiError.forbidden("You dont have permission to perform this action")
        next();
    }
}

export {authenticate,authorize}
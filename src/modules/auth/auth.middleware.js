import ApiError from "../../common/utils/api-error";
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
        ApiError.unAuthorized("User no longer exists")

    req.user={
        id:user._id,
        role:user.role,
        name:user.name,
        email:user.email
    };
    next()
}

export {authenticate}
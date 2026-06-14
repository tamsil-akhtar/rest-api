import crypto from "crypto"
import jwt from "jsonwebtoken"
import "dotenv/config"
const generateAccessToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
        expiresIn:process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    })
}
const verifyToken=(Token)=>{
    return jwt.verify(Token,process.env.JWT_ACCESS_SECRET)
}

const generateRefreshToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    })
}
const verifyRefreshToken=(Token)=>{
    return jwt.verify(Token,process.env.JWT_REFRESH_SECRET)
}

const generateResetToken=()=>{
    const rawToken=crypto.randomBytes(32).toString("hex")
    const hashToken=crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex") 

    return {rawToken,hashToken}
}

export {generateResetToken,verifyRefreshToken,verifyToken,generateAccessToken,generateRefreshToken}
import ApiError from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js"
import User from "./auth.model.js"

const hashToken=(token)=>{
    return crypto.createHash("sha256").update(token).digest("hex")
}
    
const registerUser=async ({name,email,password,role})=>{
    const existing =await User.findOne({email})
        if(existing)
          throw new ApiError.conflict("Email already exist")
    const{rawToken,hashToken}=generateResetToken()

    await User.create({
        name,
        email,
        password,
        role,
        verifiedToken:hashToken
    })
    //send an email to user with token:rawtoken
}


const login=async ({email,password})=>{
    const user=await User.findOne({email}).select("+password")
    if(!user)
        throw new ApiError.unAuthorized("Inavlid email or password!") 
    const isMatch=await user.comparePassword(password)

    if(!isMatch)
        throw ApiError.notFound("Password not match")
    if(!user.isVerified)
        throw new ApiError.forbidden("Please verify your email before login")
    const accessToken=generateAccessToken({id:user._id,role:user.role})
    const refreshToken=generateRefreshToken({id:user._id})

    user.refreshToken=hashToken(refreshToken)

    await user.save({validateBeforeSave:false})

    const userObj=user.toObject()
    delete userObj.password
    delete userObj.refreshToken
    return{user:userObj,accessToken,refreshToken}
}

const Refresh=async (token)=>{
    if(!token)
        throw new ApiError.unAuthorized("Refresh Token Missing")
    const decoded=verifyRefreshToken(token)

    const user=await User.findById(decoded.id).select("+refreshToken")
    if(!user)
        throw new ApiError.unAuthorized("User not found")
    if(user.refreshToken!==hashToken(token))
        throw new ApiError.unAuthorized("Invalid refresh Token")

    const accessToken=generateAccessToken({id:user._id,role:user.role})
    const refreshToken=generateRefreshToken({id:user._id})

    user.refreshToken=hashToken(refreshToken)

    await user.save({
        validateBeforeSave:false
    })
    return {accessToken,refreshToken}; 
}

const logout=async (userId)=>{
   await User.findByIdAndUpdate(userId,{
    refreshToken:null
})

}

const forget_password=async ({email})=>{
    const user=await User.findOne({email})

    if(!user)
        throw new ApiError.notFound("No account with that email")

    const {rawToken,hashToken}=generateResetToken()
    user.resetPasswordToken=hashToken

    user.resetPasswordExpires=Date.now()+15*60*1000

    await user.save({
        validateBeforeSave:false
    })
    return {rawToken}
    //TODO :Mail bhejna nhi aata
}
const new_Password=async ({token,new_pass})=>{
    const hashedtoken=hashToken(token)

    const user=await User.findOne({resetPasswordToken:hashedtoken,resetPasswordExpires:{
        $gt:Date.now()
    }}).select("+password")

    if(!user)
        throw new ApiError.unAuthorized("Invalid token")

    user.password=new_pass
    user.resetPasswordToken=undefined
    user.resetPasswordExpires=undefined

    await user.save()

    return {
        message:"Password reset successfull"
    }
}
export {registerUser,login,Refresh,forget_password,new_Password,logout}
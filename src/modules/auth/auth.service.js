import { sendVerificationEmail } from "../../common/config/email.js"
import ApiError from "../../common/utils/api.error.js"
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js"
import User from "./auth.model.js"
import crypto from "crypto"

const hashToken=(token)=>{
    return crypto.createHash("sha256").update(token).digest("hex")
}

const registerUser=async ({name,email,password,role})=>{
    const existing =await User.findOne({email})
        if(existing)
          throw ApiError.conflict("Email already exist")
    const{rawToken,hashToken:hashedToken}=generateResetToken()

    const user=await User.create({
        name,
        email,
        password,
        role,
        verifiedToken:hashedToken
    })
    
   try {
    console.log("Sending verification email to:", email);
    await sendVerificationEmail(email, rawToken);
    console.log("Verification email sent successfully");
    } catch (error) {
         console.error("EMAIL ERROR:", error);
    }
    //send an email to user with token:rawtoken
    const userobj=user.toObject()

    delete userobj.password
    delete userobj.verifiedToken

    return {userobj}
}


const login=async ({email,password})=>{
    const user=await User.findOne({email}).select("+password")
    if(!user)
        throw new ApiError.unAuthorized("Inavlid email") 

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
        return new ApiError.unAuthorized("Refresh Token Missing")
    const decoded=verifyRefreshToken(token)

    const user=await User.findById(decoded.id).select("+refreshToken")
    if(!user)
        return new ApiError.unAuthorized("User not found")
    if(user.refreshToken!==hashToken(token))
        return new ApiError.unAuthorized("Invalid refresh Token")

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
        return new ApiError.notFound("No account with that email")

    const {rawToken,hashToken}=generateResetToken()
    user.resetPasswordToken=hashToken

    user.resetPasswordExpires=Date.now()+15*60*1000

    await user.save({
        validateBeforeSave:false
    })
    return {rawToken}
    //TODO :Mail bhejna nhi aata
}
const verifyEmail = async (token) => {
    const hashedToken = hashToken(token);
    console.log("TOKEN FROM URL:", token);
    console.log("HASHED URL TOKEN:", hashedToken);
    const user = await User.findOne({
        verifiedToken: hashedToken
    }).select("+verifiedToken");
    if (!user) {
        throw ApiError.notFound("Invalid or expired verification token");
    }
    user.isVerified = true;
    user.verifiedToken = undefined;
    await user.save();
    return user;
};
const new_Password=async ({token,new_pass})=>{
    const hashedtoken=hashToken(token)

    const user=await User.findOne({resetPasswordToken:hashedtoken,resetPasswordExpires:{
        $gt:Date.now()
    }}).select("+password")

    if(!user)
        return new ApiError.unAuthorized("Invalid token")

    user.password=new_pass
    user.resetPasswordToken=undefined
    user.resetPasswordExpires=undefined

    await user.save()

    return {
        message:"Password reset successfull"
    }
}
const getMe=async (userId)=>{
    const user=await User.findById(userId)
    if(!user)
        return new ApiError.notFound("User not found")
    return user
}
export {registerUser,login,Refresh,forget_password,new_Password,logout,getMe,verifyEmail}
import ApiResponse from "../../common/utils/api.response.js"
import * as Register from "./auth.service.js"

const register=async (req,res) => {
    const user=await Register.registerUser(req.body)
    ApiResponse.ok(res,"Registration success",user)
}

const login=async (req,res)=>{
    const {user,accessToken,refreshToken}=await Register.login(req.body)

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        maxAge:7*24*60*60*1000//7 days
    })
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:true,
        maxAge:7*24*60*60*1000//7 days
    })

    ApiResponse.ok(res,"Login successfully!",{user,accessToken,refreshToken})
}
const logout=async (req,res)=>{
    await Register.logout(req.user.id)
    res.clearCookie("refreshToken","accessToken")
    ApiResponse.ok(res,"Logout success")
}

const getMe=async (req,res)=>{
    const user=await Register.getMe(req.user.id)
    res.ok(res,"User profile",user)
}
const verifyEmail = async (req, res) => {
    const user = await Register.verifyEmail(req.params.token);

    ApiResponse.ok(
        res,
        "Email verified successfully",
        user
    );
};
export {register,login,logout,getMe,verifyEmail} 
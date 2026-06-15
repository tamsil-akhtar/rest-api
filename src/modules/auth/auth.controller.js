import ApiResponse from "../../common/utils/api-response"
import * as Register from "./auth.service"

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

    ApiResponse.ok(res,"Login successfully!",{user,accessToken})
}
const logout=async (req,res)=>{
    await Register.logout(req.user.id)
    res.clearCookie("refreshToke","accessToken")
    ApiResponse.ok(res,"Logout success")
}
export {register} 
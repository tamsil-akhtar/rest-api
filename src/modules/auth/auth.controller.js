import ApiResponse from "../../common/utils/api-response"
import * as Register from "./auth.service"

const register=async (req,res) => {
    const user=await Register.registerUser(req.body)
    ApiResponse.ok(res,"Registration success",user)
}

export {register} 
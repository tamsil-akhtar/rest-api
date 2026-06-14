import BaseDto from "../../../common/dto/base.dto"
import Joi from "joi"

class RegisterDto extends BaseDto{
    static schema=Joi.object({
        name:Joi.string().trim().min(2).required(),
        email:Joi.string().email().lowercase().required(),
        password:Joi.string().message("Password must contain 8 chars min").min(8).required(),
        role:Joi.string().valid("Customer","Seller").default("Customer")
    })
}

export default RegisterDto
import BaseDto from "../../../common/dto/base.dto"
import Joi from "joi"

class loginDto extends BaseDto{
    static schema=Joi.object({
        email:Joi.string().email().lowercase().required(),
        password:Joi.string().required()
    })
}

export default loginDto
import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class ForgetPasswordDto extends BaseDto{
    static schema=Joi.object({
        email:Joi.string().lowercase().required()
    })
}

export default ForgetPasswordDto
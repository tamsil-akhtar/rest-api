import Joi from "joi";

import BaseDto from "../../../common/dto/base.dto";

class resetPasswordDto extends BaseDto{
    static schema=Joi.object({
        password:Joi.string()
        .min(8)
        .pattern(/(?=.*[A-Z])(?=.*\d)/)
        .message(
            "Password must contain atleast one uppercase letter and one digit"
        )
        .required()
    })
}

export default resetPasswordDto
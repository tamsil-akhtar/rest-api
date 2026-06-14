import { Router } from "express";
import * as Controller from "./auth.controller.js"
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/regster.dto.js";
const router=Router()

router.post("Register/",validate(RegisterDto),Controller.register)
export default router
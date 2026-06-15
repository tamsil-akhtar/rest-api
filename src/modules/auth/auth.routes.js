import { Router } from "express";
import * as Controller from "./auth.controller.js"
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/regster.dto.js";
import { authenticate } from "./auth.middleware.js";
import loginDto from "./dto/login.dto.js";
const router=Router()

router.post("/register",validate(RegisterDto),Controller.register)

router.post("/login",validate(),Controller.login)
router.get("/profile",authenticate(loginDto),Controller.getMe)
export default router
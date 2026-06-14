import ApiError from "../../common/utils/api-error";

import User from "./auth.model.js"

const authenticate=async (req,resizeBy,next)=>{
      let token;

      if(req.headers.authorization?.startsWith("Bearer"))
        token=req.headers.authorization.split(" ")[1]
    next()
}

export {authenticate}
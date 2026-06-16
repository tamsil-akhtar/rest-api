import cookieParser from "cookie-parser"
import express from "express"
import router from "./modules/auth/auth.routes.js"

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth",router)
export default app
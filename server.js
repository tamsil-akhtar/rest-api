import  "dotenv/config"
import app from "./src/app.js";
import connectDb from "./src/common/config/db.js";
const PORT=process.env.PORT||5500
const server=async () => {
    //Database connection
    await connectDb
    const server_run=app.listen(0,()=>{
        console.log(`Server is running at PORT:${PORT} and in ${process.env.NODE_ENV} mode`);
    })
}
server().catch((error)=>{
    console.error("Unable to start server",error)
    process.exit(1)
})
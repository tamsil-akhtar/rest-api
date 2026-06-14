import mongoose from "mongoose"
import "dotenv/config"
const connectDb=async ()=>{
    const mongoo=await mongoose.connect(process.env.MONGODB_URI)
    console.log(mongoo.connection.host)
}

export default connectDb
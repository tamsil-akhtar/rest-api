import mongoose from "mongoose"
import "dotenv/config"
const connectDb=async ()=>{
    const mongoo=await mongoose.connect(process.env.MONGO_URI)
    console.log(mongoo.connection.host)
}

export default connectDb
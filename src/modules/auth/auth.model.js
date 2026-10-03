import { timeLog } from "console"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:10,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        requires:[true,"Password is required"],
        minlength:8,
        select:false 
        //We know;
    },
    role:{
        type:String,
        enum:["customer","admin","seller"],
        default:"customer"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verifiedToken:{type:String,select:false},
    refreshToken:{type:String,select:false},
    resetPasswordToken:{type:String,select:false},
    resetPasswordExpires:{type:String,select:false},
},{timeLog:true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword=async function(clearTextPassword){
    return bcrypt.compare(clearTextPassword,this.password)
}
export default mongoose.model("User",userSchema)
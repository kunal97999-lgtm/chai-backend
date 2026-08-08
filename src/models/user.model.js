import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required : true,
        unique:true,
        lowercase :true,
        trim: true,
        index:true
    },
    email:{
        type:String,
        required : true,
        unique:true,
        lowercase :true,
        trim: true
    },
    fullName:{
        type:String,
        required : true,
        trim: true,
        index:true
    },
    avatar:{
        type:String,
        required : true,
    },
    coverImage:{
        type:String,
    },
    watchHistory :[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type:String,
        required: [true,'Password is required']
    },
    refreshToken:{ // jab bhi koi user log in krta hai toh access token generate ho jate hia , or kuch time abad expire bhi toh kya user dobara log in kre 
        //isiliye refresh token generate krte hai taki labme time tk chale
        //imp
        // toh access token ki valididty kyu nahi bada dete because agar ksisi ne steal krliye access token then vo use kr skta hai tumare account ko
        
        type:String
    }

},{timestamps:true})


userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email : this.email,
        username : this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,//It is a secret key used to sign and verify JWTs. Only the server should know this key.
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign({
        _id: this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}



export const User = mongoose.model("User",userSchema)
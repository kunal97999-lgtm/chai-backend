import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
}); // this connect mera backend to cloudinary account or yeh sab values ati hai .env file se


const uploadOnCloudinary = async (localFilePath)=>{ // this function receive the localFilePath like public/temp/avataar.png  joki multer me save hoti hai
    
    try {
        if(!localFilePath) return null
        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
        })
        // file has been successfully uploaded 
        // console.log("file is uploaded on cloudinary ",response.url)
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Cloudinary upload failed: ", error)
        fs.unlinkSync(localFilePath) // remove the locally saved tempory file as the upload opeartion got failed
        return null;
    }
}


export {uploadOnCloudinary}
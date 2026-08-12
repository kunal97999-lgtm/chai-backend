import { Router } from "express";
import { loginUser,
    registerUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword, 
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile,
    getWatchHistory } from "../controllers/user.contoller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([ // this request firsst go to multer not the controller
        {
            name: "avatar", // means accept one file whose field name is avatar 
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser) // this is the controller isko isiliye registerUser() nahi likha kyuki express calls it for us when the request arrives
    // is regusterUser() use kra hota toh server start hote hi function execute ho jta 




router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWTOptional,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)


export default router
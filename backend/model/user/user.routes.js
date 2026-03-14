import { Router } from "express"
import {
  createuser,
  login,
  sendEmail,
  forgetPassword,
  verifyToken,
  changePassword,
  logOut,
  getData,
  googleLogin,
  updateUser,
  uploadImageFile,
  deleteImage,
} from "./user.controller.js";
import { userGuird, verifyTokenGuird } from "../../src/middleWare/guird.middle.js";
import { cloudinaryFileUploader } from "../../src/middleWare/fileUploder.js";

const router =Router()
router.post("/signup", createuser)
router.post("/login", login)
router.post("/send-mail",sendEmail)
router.post("/forget-password",forgetPassword)
router.get("/logout", logOut);
router.get("/getdata",userGuird,getData);
router.get("/session", userGuird, (req, res) => {
  return res.json(req.user)
});
router.post("/verify-token",verifyTokenGuird, verifyToken);
router.put("/change-password", verifyTokenGuird, changePassword);
router.post("/google-login",googleLogin)
router.put("/updateuser/:id", userGuird, updateUser);
router.put("/uploadFile/:id", cloudinaryFileUploader.single('profileImage'),uploadImageFile);
router.delete("/deleteProfileImage/:id",deleteImage);
export default router;
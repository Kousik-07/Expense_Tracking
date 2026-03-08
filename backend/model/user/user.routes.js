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
} from "./user.controller.js";
import { userGuird, verifyTokenGuird } from "../../src/middleWare/guird.middle.js";

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

export default router;
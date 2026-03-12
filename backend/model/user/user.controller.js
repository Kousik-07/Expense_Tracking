import userdata from "./user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendMail } from "../../utils/mail.js";
import { otpTemplate } from "../../utils/otpTemplates.js";
import { generateOtp } from "../../utils/generateOTP.js";
import { forgotPasswordTemplate } from "../../utils/forgetPasswordTemplates.js";
import { google } from "googleapis";
import { oauth2client } from "../../utils/googleConfig.js";
export const createuser = async (req, res) => {
    try {
        const data = req.body;
        const user = new userdata(data)
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const sendEmail = async (req, res) => {
    try {
        const {email}=req.body
        const OTP = generateOtp()
        const isEmail = await userdata.findOne({ email })
        if (isEmail) {
            return res.status(400).json({message:"Already exists" })
        }
        await sendMail(email, "OTP for sign up", otpTemplate(OTP))
        res.json({
            message: "send mail succefull",
            otp: OTP,
            success:true
        })
        
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const createToken = async (user) => {
    const paylode = {
        id: user._id,
        fullname: user.fullname,
        email:user.email
    }
    const token = await jwt.sign(paylode, process.env.AUTH_SECRET, { expiresIn: "1d" })
    return token;
}

export const login = async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await userdata.findOne({ email })
        if (!user) 
            return res.status(404).json({message:"User doesnot exist"})
        const isloged = await bcrypt.compare(password,user.password)
        // console.log(password);
        
        if (!isloged)
            return res.status(401).json({ message: "wrong password" })
        const token = await createToken(user)
        res.cookie("authToken", token, {

          maxAge: 86400000,
          domain: undefined,
          secure: process.env.ENVIROMENT !== "DEV",
            sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
            path:"/",
          httpOnly:true
          
        });
        res.json({message:"login done"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const logOut = async (req, res) => {
  try {
     res.cookie("authToken", null, {
       httpOnly: true,
       secure: process.env.ENVIROMENT !== "DEV",
       sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
       path: "/",
       domain: undefined,
       maxAge: 0,
     });
     res.status(200).json({ message:"Logout Successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Logout failed" });
  }
};
export const forgetPassword = async (req, res) => {
  try {
      const {email} = req.body;
      const user = await userdata.findOne({ email });
      if (!user) {
        return res.status(404).json({message:"Email id not match"})
      }
      const token = await jwt.sign({ id: user._id }, process.env.FORGOT_TOKEN, { expiresIn: "15m" })
      const link = `${process.env.DOMAIN}/forgetpassword?token=${token}`
      const send = await sendMail(
        email,
        "Expence -forget password",
        forgotPasswordTemplate(user.fullname,link)
      );
      if (!send) {
        res.status(424).json({message:"Email sending failed!!"})
      }
      res.json({message:"please check your email"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
    try {
        res.json({message:"verification success"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const changePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const encrypet = await bcrypt.hash(password.toString(), 12);
        console.log(encrypet);
        
        await userdata.findByIdAndUpdate(req.user.id, { password: encrypet })
        res.json("Password updated successfully")
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getData = async (req, res) => {
  try {
    
      const user = await userdata.findById(req.user.id).select("fullname email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
   res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2client });
    const { data } = await oauth2.userinfo.get();

    let user = await userdata.findOne({ email: data.email });

    if (!user) {
      user = new userdata({
        fullname: data.name,
        email: data.email
      });
      await user.save();
    }

    const token = await createToken(user);

    res.cookie("authToken", token, {
      maxAge: 86400000,
      httpOnly: true,
      secure: process.env.ENVIROMENT !== "DEV",
      sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
      path: "/",
    });

    res.json({
      message: "Google Login Successful",
      user: { fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google Auth error", error: error.message });
  }
};
import mongoose from "mongoose"
import bcrypt from "bcrypt"
const mymodel = mongoose.Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
    },
    mobile: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
    cloudinary_id: String,
  },
  { timestamps: true }
);

mymodel.pre('save', async function () {
    if (!this.password) {
      return 
    }

    const hashedpassword = await bcrypt.hash(this.password.toString(), 12)
    this.password = hashedpassword;
    
})
const userdata = mongoose.model("user", mymodel)
export default userdata
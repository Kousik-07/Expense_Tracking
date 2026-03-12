import mongoose from "mongoose"
import bcrypt from "bcrypt"
const mymodel = mongoose.Schema({
    fullname: {
        type: String,
        lowercase:true
    },
    mobile: {
        type: String,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique:true
    },
    password: {
        type: String,
    },
    status: {
        type: Boolean,
        default:false
    }
}, { timestamps: true })

mymodel.pre('save', async function (next) {

    const hashedpassword = await bcrypt.hash(this.password.toString(), 12)
    this.password = hashedpassword;
    next();
    
})
const userdata = mongoose.model("user", mymodel)
export default userdata
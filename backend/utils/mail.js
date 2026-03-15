import nodemailer from "nodemailer"

const config = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});
export const sendMail = async (email,subject,template) => {
    try {
        const option = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: subject,
            html:template
        }
        await config.sendMail(option)
        return true
    } catch (error) {
        return false
    }
}
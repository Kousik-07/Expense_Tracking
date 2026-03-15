import nodemailer from "nodemailer"


export const sendMail = async (email,subject,template) => {
  try {
    console.log("Sending mail to:", email);
    const config = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
        const option = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: subject,
            html:template
        }
    await config.sendMail(option)
    console.log("Mail sent:", info.messageId);
        return true
  } catch (error) {
    console.log("Mail sent:", info.messageId);
        return false
    }
}
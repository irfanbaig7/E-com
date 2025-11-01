
// node mailer

import nodemailer from "nodemailer"

export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        }
    })

    // MAIL configuraiton
    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "email verification",
        text: `hi there, http://localhost:5173/verify/${token}, thanks`
    }

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error)
        console.log("Email sent successfully");
        console.log(info);
    })

}




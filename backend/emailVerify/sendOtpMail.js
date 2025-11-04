import nodemailer from "nodemailer"

export const sendOptMail =  async ( otp, email ) => {
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
        subject: "password reset Opt",
        html: `<p> Your password reset is : <b>${otp}</b> </p>`
    }

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error)
        console.log("otp sent successfully");
        console.log(info);
    })

}

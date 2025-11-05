// creating user registration function

import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyEmail } from "../emailVerify/verifyEmail.js"
import mongoose from "mongoose"
import { Session } from "../models/sessionModel.js"
import { sendOptMail } from "../emailVerify/sendOtpMail.js"


export const register = async (req, res) => {
    try {

        // kon kon se feild frontend se bhej raha hu
        const { firstName, lastName, email, password } = req.body

        // dont give any kind of empty field
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user already exist?
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist please user diffrent email"
            })
        }

        // hash the password
        const hashPass = await bcrypt.hash(password, 10)

        // ✅ manual id generate
        const _id = new mongoose.Types.ObjectId();

        // token gen
        const token = jwt.sign({ id: _id }, process.env.JWT_SECREATEKEY, { expiresIn: '10m' })

        // create&save user here
        const newUser = await User.create({
            _id,                   // ✅ must include this line
            firstName,
            lastName,
            email,
            password: hashPass,
            token
        })

        verifyEmail(token, email) // send email here

        // success msg
        return res.status(201).json({
            success: true,
            message: "User registered successfully..",
            user: newUser
        })

    } catch (error) {
        // console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,

        })
    }
}


// verify controller
export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                success: false,
                message: 'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(" ")[1] // Bearer
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECREATEKEY)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "the registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "token varification faild"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        user.token = null
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const reverify = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECREATEKEY, { expiresIn: '10m' })
        verifyEmail(token, email)
        user.token = token
        await user.save()
        return res.status(200).json({
            success: true,
            message: "verification email sent again successfully",
            token: user.token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are requried"
            })
        }

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exist"
            })
        }

        // if user exist then check there password was match with databases pass
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "invalid password"
            })
        }

        // check user is that verify or not
        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "verify your account then login"
            })
        }

        // create access token and refresh token
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECREATEKEY, { expiresIn: "10d" })
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECREATEKEY, { expiresIn: "30d" })

        existingUser.isLoggedIn = true
        await existingUser.save()

        // ensure already session existing or not
        const existinSession = await Session.findOne({ userId: existingUser._id })

        // if session existing then delete them
        if (existinSession) {
            await Session.deleteOne({ userId: existingUser._id })
        }

        // session create 
        await Session.create({ userId: existingUser._id })

        // scusses return
        res.status(200).json({
            success: true,
            message: `Wlecome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId }) // each created sesison that will be deleting from here
        await User.findByIdAndUpdate(userId, {
            isLoggedIn: false
        })

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const forgotpass = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        // OTP gen ( 6 digit )
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExp = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp
        user.otpExpiry = otpExp

        await user.save()

        await sendOptMail(otp, email);

        return res.status(200).json({
            success: true,
            message: "otp send to mail successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const verifyOtp = async (req, res) => {
    try {

        const { otp } = req.body;
        const email = req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "Otp is not gen or already verified"
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Otp has expired plz request new otp"
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Otp is invalid"
            })
        }

        user.otp = null
        user.otpExpiry = null

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Otp verified Successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const changePass = async (req, res) => {
    try {

        const { newPass, confirmPass } = req.body
        const { email } = req.params

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        if (!newPass || !confirmPass) {
            return res.status(400).json({
                success: false,
                message: "all feilds are required"
            })
        }

        if (newPass !== confirmPass) {
            return res.status(400).json({
                success: false,
                message: "please put same passwords"
            })
        }

        // new pas gen
        const hashPass = await bcrypt.hash(newPass, 10)
        user.password = hashPass
        await user.save()

        return res.status(200).json({
            success: true,
            message: "password changed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const allUser = async (_, res) => {
    try {
        const users = await User.find() // find(), wll be help us to get everything from DB like users,
        return res.status(200).json({
            success: true,
            message: "All users",
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// creating user registration function

import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyEmail } from "../emailVerify/verifyEmail.js"
import mongoose from "mongoose"


export const register = async (req, res) => {
    try {

        // kon kon se feild frontend se bhej raha hu
        const { firstName, lastName, email, password } = req.body

        // dont give any kind of empty field
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
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
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


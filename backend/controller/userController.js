// creating user registration function

import { User } from "../models/userModel.js"


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

        // and finally we can create user here
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        })

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


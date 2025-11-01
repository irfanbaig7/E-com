import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fristName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    profilePicPublicId: { //  this is for cloudinary public id for deletion. in profile img change that's why we use for each img there own id for { updation }
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    phone: {
        type: String,
    },


}, { timestamps: true })

export const User = mongoose.model("User", userSchema)
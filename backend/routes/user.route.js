// using express creating routes

import express from "express";
import { allUser, changePass, forgotpass, login, logout, register, reverify, verify, verifyOtp } from "../controller/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router()

router.post("/register", register)
router.post("/verify", verify)
router.post("/reverify", reverify)
router.post("/login", login)
router.post("/logout", isAuthenticated, logout)
router.post("/forgot-password", forgotpass)
router.post("/verify-otp/:email", verifyOtp)
router.post("/change-pass/:email", changePass)
router.get("/all-user", isAuthenticated, isAdmin, allUser)

export default router

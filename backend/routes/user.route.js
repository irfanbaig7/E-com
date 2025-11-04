// using express creating routes

import express from "express";
import { forgotpass, login, logout, register, reverify, verify } from "../controller/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router()

router.post("/register", register)
router.post("/verify", verify)
router.post("/reverify", reverify)
router.post("/login", login)
router.post("/logout", isAuthenticated, logout)
router.post("/forgot-password", forgotpass)

export default router

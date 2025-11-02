// using express creating routes

import express from "express";
import { register, reverify, verify } from "../controller/userController.js";


const router = express.Router()

router.post("/register", register)
router.post("/verify", verify)
router.post("/reverify", reverify)

export default router

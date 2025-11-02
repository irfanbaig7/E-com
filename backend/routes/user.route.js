// using express creating routes

import express from "express";
import { register, verify } from "../controller/userController.js";


const router = express.Router()

router.post("/register", register)
router.get("/verify", verify)

export default router

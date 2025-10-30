import express from "express"
import { connectDB } from "./database/db.js"
const app = express()
const PORT = process.env.PORT || 7500

app.listen(PORT, () => {
    connectDB()
    console.log(`server is listeing at port : ${PORT}`);  
})


 





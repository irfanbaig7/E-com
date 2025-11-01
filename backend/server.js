import express from "express"
import { connectDB } from "./database/db.js"
import userRoute from "./routes/user.route.js"
const app = express()
const PORT = process.env.PORT || 7500

// middleware 
app.use(express.json())

app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    connectDB()
    console.log(`server is listeing at port : ${PORT}`);  
})

 





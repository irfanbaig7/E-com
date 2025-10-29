import express from "express"
const app = express()
const PORT = process.env.PORT || 7500

app.listen(PORT, () => {
    console.log(`server is listeing at port : ${PORT}`);  
})


 





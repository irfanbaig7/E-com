import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ECom`)
        console.log("mongodb conneted successfully");
        
    } catch (error) {
        console.log("mongodb connection faild ",error);
        
    }
}
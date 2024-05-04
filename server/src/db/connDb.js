import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

 const connectDb = async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         console.log("MongoDB connected successfully");
    } catch (error) {
       console.error("MongoDB connection error:", err);
       process.exit(1)
    }
}


export default connectDb;
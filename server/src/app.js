import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json())
app.use(express.urlencoded())//extended:true
app.use(express.static)
app.use(cookieParser())

//routes
import userRouter from "./routes/userRoute.js"

app.use("/api/users",userRouter)


export {app}
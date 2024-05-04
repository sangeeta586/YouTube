//require('dotenv').config()
import express from "express"
import connectDb from "../db/connDb.js"
import dotenv from 'dotenv';
dotenv.config({
    path :'.env'
});

const app = express()
const port = process.env.PORT || 8000; 
connectDb().then(() =>{
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    }); 
})
.catch((error) => console.log("mongodb connection failed !!!!"))






import mongoose from "mongoose"
console.log("process.env.MONGODB_URI ",process.env.MONGODB_URI )

 const connectDb = async () => {
   mongoose.connect(process.env.MONGODB_URI
   ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
   )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  })};
export default connectDb;
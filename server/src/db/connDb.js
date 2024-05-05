import mongoose from "mongoose"


 const connectDb = async () => {
   mongoose.connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  })};
export default connectDb;
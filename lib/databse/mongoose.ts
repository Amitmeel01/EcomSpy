import mongoose from 'mongoose';

let isConnected = false;// Variable to track the connection status

const connectDb = async () => {
  mongoose.set('strictQuery', true);

  if(!process.env.MONGO_URL) return console.log('MONGODB_URI is not defined');

  if(isConnected) return console.log('=> using existing database connection');

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;

    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error)
  }
}

export default connectDb;
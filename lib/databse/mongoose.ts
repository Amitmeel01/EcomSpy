import mongoose from 'mongoose';

let isConnected = false;// Variable to track the connection status

const connectDb = async () => {
  mongoose.set('strictQuery', true);

  if(!"mongodb+srv://Amit-01:Amit123@cluster0.enrduq9.mongodb.net/WebScraping?retryWrites=true&w=majority&appName=Cluster0") return console.log('MONGODB_URI is not defined');

  if(isConnected) return console.log('=> using existing database connection');

  try {
    await mongoose.connect("mongodb+srv://Amit-01:Amit123@cluster0.enrduq9.mongodb.net/WebScraping?retryWrites=true&w=majority&appName=Cluster0");

    isConnected = true;

    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error)
  }
}

export default connectDb;
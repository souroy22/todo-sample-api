import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;

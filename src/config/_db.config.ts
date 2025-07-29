import mongoose from "mongoose";
import { ENV } from "@/config";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.DB_URI, {
      user: ENV.DB_USER,
      pass: ENV.DB_PASS,
      dbName: ENV.DB_NAME,
    });
    console.log(`Database connected!`);
  } catch (error) {
    console.log(`Database Connection failed!`, error);
  }
};

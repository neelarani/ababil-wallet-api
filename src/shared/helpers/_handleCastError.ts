import mongoose from "mongoose";
import { TGenericErrorResponse } from "@/interface";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID. Please provide a valid id",
  };
};

import { Response } from "express";
import { IQBMeta } from "mongoose-qb";

interface TMeta extends IQBMeta {}

interface TResponse<T> {
  status: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T;
}

export const sendResponse = <T>(res: Response, info: TResponse<T>) => {
  res.status(info.status).json({
    status: info.status,
    success: info.success,
    message: info.message,
    meta: info.meta,
    data: info.data,
  });
};

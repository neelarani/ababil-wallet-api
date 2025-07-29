import { catchAsync, HTTP_CODE, sendResponse } from "@/shared";

export const notFound = catchAsync(async (_, res) => {
  sendResponse(res, {
    success: false,
    status: HTTP_CODE.NOT_FOUND,
    message: "Route not found!",
  });
});

import { HTTP_CODE } from '../constants';
import { catchAsync, sendResponse } from '../util';

export const rootResponse = catchAsync(async (_, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Welcome to Ababil Wallet API',
  });
});

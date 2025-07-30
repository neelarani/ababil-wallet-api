import { util, constants } from '@/shared';

export const rootResponse = util.catchAsync(async (_, res) => {
  util.sendResponse(res, {
    success: true,
    status: constants.HTTP_CODE.OK,
    message: 'Welcome to Ababil Wallet API ❤️ྀི',
  });
});

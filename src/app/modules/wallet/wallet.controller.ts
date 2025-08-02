import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import * as service from './wallet.service';

export const blockWallet = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Wallet Blocked successfully!',
    data: await service.blockWallet(req.params.userId),
  });
});

export const unblockWallet = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Wallet Unblocked successfully',
    data: await service.unblockWallet(req.params.userId),
  });
});

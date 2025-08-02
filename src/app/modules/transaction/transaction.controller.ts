import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import * as service from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';
import { ITransaction } from './transaction.interface';
import { IWallet } from '../wallet/wallet.interface';

export const topUpMoney = catchAsync(async (req, res) => {
  sendResponse<{ transaction: ITransaction; wallet: IWallet }>(res, {
    success: true,
    status: HTTP_CODE.CREATED,
    message: 'top up money successful',
    data: await service.topUpMoney(req.body, req.user as JwtPayload),
  });
});

export const withdraw = catchAsync(async (req, res) => {
  const result = await service.withdraw(req.body, req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Withdraw successful',
    data: result,
  });
});

export const sendMoney = catchAsync(async (req, res) => {
  const result = await service.sendMoney(req.body, req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Money sent successfully',
    data: result,
  });
});

export const transactionHistory = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Transaction History retrieved successfully',
    data: await service.transactionHistory(
      req.query as Record<string, string>,
      req.user as JwtPayload
    ),
  });
});

export const cashIn = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Cash In Successful',
    data: await service.cashIn(req.body, req.user as JwtPayload),
  });
});

export const cashOut = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Cash Out Successful',
    data: await service.cashOut(req.body, req.user as JwtPayload),
  });
});

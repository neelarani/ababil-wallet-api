import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import * as service from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';
import { ITransaction } from './transaction.interface';
import { IWallet } from '../wallet/wallet.interface';
import { withdrawMoney } from '../transaction/transaction.service';

export const topUpMoney = catchAsync(async (req, res) => {
  sendResponse<{ transaction: ITransaction; wallet: IWallet }>(res, {
    success: true,
    status: HTTP_CODE.CREATED,
    message: 'top up money successful',
    data: await service.topUpMoney(req.body, req.user as JwtPayload),
  });
});

export const withdraw = catchAsync(async (req, res) => {
  const result = await withdrawMoney(req.body, req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Withdraw successful',
    data: result,
  });
});

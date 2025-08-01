import { JwtPayload } from 'jsonwebtoken';
import { ITransaction, TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';
import { AppError } from '@/app/errors';
import { HTTP_CODE } from '@/shared';
import { Wallet } from '../wallet/wallet.model';

export const topUpMoney = async (
  payload: ITransaction,
  decodedToken: JwtPayload
) => {
  let wallet = await Wallet.findOne({ user: decodedToken.userId });

  if (!wallet)
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `No wallet has been found for your account!`
    );

  let transaction = await Transaction.create({
    amount: payload.amount,
    receiver: decodedToken.userId,
    transactionType: TransactionType.TOP_UP,
  });

  if (!transaction)
    throw new AppError(HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to top up`);

  const updatedWallet = await Wallet.findByIdAndUpdate(
    wallet._id,
    {
      $set: { balance: wallet.balance + payload.amount },
    },
    { new: true, runValidators: true }
  );

  if (!updatedWallet)
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to store updated balance in wallet`
    );

  return {
    transaction,
    wallet: updatedWallet,
  };
};

export const withdrawMoney = async (
  payload: ITransaction,
  decodedToken: JwtPayload
) => {
  const wallet = await Wallet.findOne({ user: decodedToken.userId });

  if (!wallet)
    throw new AppError(HTTP_CODE.INTERNAL_SERVER_ERROR, `Wallet not Found!`);

  if (wallet.balance < payload.amount) {
    throw new AppError(
      HTTP_CODE.BAD_REQUEST,
      `Insufficient balance in wallet!`
    );
  }

  const transaction = await Transaction.create({
    amount: payload.amount,
    sender: decodedToken.userId,
    transactionType: TransactionType.WITHDRAW,
  });

  if (!transaction)
    throw new AppError(HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to withdraw`);

  const updatedWallet = await Wallet.findByIdAndUpdate(
    wallet._id,
    {
      $set: { balance: wallet.balance - payload.amount },
    },
    { new: true, runValidators: true }
  );

  if (!updatedWallet)
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to update wallet balance`
    );

  return {
    transaction,
    wallet: updatedWallet,
  };
};

import { JwtPayload } from 'jsonwebtoken';
import { ITransaction, TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';
import { AppError } from '@/app/errors';
import { HTTP_CODE } from '@/shared';
import { Wallet } from '../wallet/wallet.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

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

export const withdraw = async (
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

export const sendMoney = async (
  payload: { receiverId: string; amount: number },
  decodedToken: JwtPayload
) => {
  if (decodedToken.userId === payload.receiverId) {
    throw new AppError(HTTP_CODE.BAD_REQUEST, `Cannot send money to yourself`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({
      user: decodedToken.userId,
    }).session(session);
    const receiverWallet = await Wallet.findOne({
      user: payload.receiverId,
    }).session(session);

    if (!senderWallet || !receiverWallet) {
      throw new AppError(
        HTTP_CODE.NOT_FOUND,
        `Sender or receiver wallet not found`
      );
    }

    if (senderWallet.balance < payload.amount) {
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `Insufficient balance in wallet`
      );
    }

    senderWallet.balance -= payload.amount;
    receiverWallet.balance += payload.amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = await Transaction.create(
      [
        {
          sender: decodedToken.userId,
          receiver: payload.receiverId,
          amount: payload.amount,
          transactionType: TransactionType.SEND_MONEY,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { transaction, senderWallet, receiverWallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const transactionHistory = async (userId: string) => {
  const user = await User.findById(userId).populate('transaction');

  if (!user) {
    throw new AppError(HTTP_CODE.NOT_FOUND, 'User not found!');
  }

  return user;
};

import { JwtPayload } from 'jsonwebtoken';
import { ITransaction, TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';
import { AppError } from '@/app/errors';
import { HTTP_CODE } from '@/shared';
import { Wallet } from '../wallet/wallet.model';
import { startSession } from 'mongoose';
import { useQuery } from 'mongoose-qb';
import { Role } from '../user/user.interface';
import { User } from '../user/user.model';
import { isWalletBlocked } from '../wallet/wallet.service';

export const topUpMoney = async (
  payload: ITransaction,
  decodedToken: JwtPayload
) => {
  let wallet = await Wallet.findOne({ user: decodedToken.userId });

  if (!wallet || (await isWalletBlocked(wallet._id)))
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `No wallet has been found or might be blocked for your account!`
    );

  let transaction = await Transaction.create({
    receiver: decodedToken.userId,
    amount: payload.amount,
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

  if (!wallet || (await isWalletBlocked(wallet._id)))
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `No wallet has been found or might be blocked for your account!`
    );

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
  const session = await startSession();
  session.startTransaction();

  try {
    if (decodedToken.userId === payload.receiverId) {
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `Cannot send money to yourself`
      );
    }

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

    if (
      (await isWalletBlocked(senderWallet._id)) ||
      (await isWalletBlocked(receiverWallet._id))
    )
      throw new AppError(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        `Sender or receiver wallet might be blocked!`
      );

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

    const transaction = (
      await Transaction.create(
        [
          {
            sender: decodedToken.userId,
            receiver: payload.receiverId,
            amount: payload.amount,
            transactionType: TransactionType.SEND_MONEY,
          },
        ],
        { session }
      )
    )[0];

    await session.commitTransaction();
    session.endSession();

    return { transaction, senderWallet, receiverWallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const transactionHistory = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const { author_type, userId, ...rest } = query || {};
  const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(decodedToken.role);

  if (!author_type && !isAdmin)
    throw new AppError(
      HTTP_CODE.BAD_REQUEST,
      `You must provide author_type params in request, [e.g. ?author_type=sender, ?author_type=receiver]`
    );

  query = isAdmin
    ? { ...rest, [author_type]: userId }
    : {
        ...rest,
        [author_type]: decodedToken.userId,
      };

  return await useQuery(Transaction, query, {
    filter: true,
    paginate: true,
    populate: [
      { path: 'sender', select: 'name email phone' },
      { path: 'receiver', select: 'name email phone' },
    ],
  });
};

export const cashIn = async (
  payload: {
    receiverId: string;
    amount: number;
  },
  decodedToken: JwtPayload
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    if (decodedToken.userId === payload.receiverId) {
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `You can't cash in to yourself`
      );
    }

    const receiver = await User.findById(payload.receiverId).session(session);

    if (!receiver)
      throw new AppError(HTTP_CODE.NOT_FOUND, `Receiver not found`);

    if (receiver.role !== Role.USER)
      throw new AppError(HTTP_CODE.BAD_REQUEST, `Receiver must be an USER`);

    let receiverWallet = await Wallet.findOne({ user: receiver._id }).session(
      session
    );

    let agentWallet = await Wallet.findOne({
      user: decodedToken.userId,
    }).session(session);

    if (!receiverWallet || !agentWallet)
      throw new AppError(
        HTTP_CODE.NOT_FOUND,
        `Receiver or agent wallet not found`
      );

    if (
      (await isWalletBlocked(receiverWallet._id)) ||
      (await isWalletBlocked(agentWallet._id))
    )
      throw new AppError(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        `Receiver or agent wallet might be blocked!`
      );

    if (payload.amount > agentWallet.balance)
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `Insufficient balance in agent wallet`
      );

    agentWallet.balance -= payload.amount;
    receiverWallet.balance += payload.amount;

    await agentWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = (
      await Transaction.create(
        [
          {
            sender: decodedToken.userId,
            receiver: payload.receiverId,
            amount: payload.amount,
            transactionType: TransactionType.CASH_IN,
          },
        ],
        { session }
      )
    )[0];

    await session.commitTransaction();
    session.endSession();

    return { transaction, agentWallet, receiverWallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const cashOut = async (
  payload: {
    receiverId: string;
    amount: number;
  },
  decodedToken: JwtPayload
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    if (decodedToken.userId === payload.receiverId)
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `You can't cash out to yourself`
      );

    const receiver = await User.findById(payload.receiverId).session(session);

    if (!receiver)
      throw new AppError(HTTP_CODE.NOT_FOUND, `Receiver not found`);

    if (receiver.role !== Role.AGENT)
      throw new AppError(HTTP_CODE.BAD_REQUEST, `Receiver must be an AGENT`);

    let receiverWallet = await Wallet.findOne({
      user: payload.receiverId,
    }).session(session);

    let senderWallet = await Wallet.findOne({
      user: decodedToken.userId,
    }).session(session);

    if (!receiverWallet || !senderWallet)
      throw new AppError(
        HTTP_CODE.NOT_FOUND,
        `Receiver or agent wallet not found`
      );

    if (
      (await isWalletBlocked(receiverWallet._id)) ||
      (await isWalletBlocked(senderWallet._id))
    )
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `Receiver or agent wallet might be blocked!`
      );

    if (payload.amount > senderWallet.balance)
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `Insufficient balance in agent wallet`
      );

    senderWallet.balance -= payload.amount;
    receiverWallet.balance += payload.amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = (
      await Transaction.create(
        [
          {
            sender: decodedToken.userId,
            receiver: payload.receiverId,
            amount: payload.amount,
            transactionType: TransactionType.CASH_OUT,
          },
        ],
        { session }
      )
    )[0];

    await session.commitTransaction();
    session.endSession();

    return { transaction, senderWallet, receiverWallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

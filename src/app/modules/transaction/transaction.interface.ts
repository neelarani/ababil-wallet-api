import { ObjectId } from 'mongoose';

export enum TransactionType {
  TOP_UP = 'TOP_UP',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  SEND_MONEY = 'SEND_MONEY',
  WITHDRAW = 'WITHDRAW',
}

export interface ITransaction {
  sender?: ObjectId;
  receiver: ObjectId;
  transactionType: TransactionType;
  amount: number;
}

import { model, Schema } from 'mongoose';
import { ITransaction, TransactionType } from './transaction.interface';
import { Collections } from '@/interface';

const transactionSchema = new Schema<ITransaction>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: Collections.User,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: Collections.User,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  Collections.Transaction,
  transactionSchema
);

import { Schema, model } from 'mongoose';
import { IWallet } from './wallet.interface';
import { Collections } from '@/interface';

const walletSchema = new Schema<IWallet>({
  user: {
    type: Schema.Types.ObjectId,
    ref: Collections.User,
  },
  balance: {
    type: Number,
    default: 50,
  },
});

export const Wallet = model<IWallet>(Collections.Wallet, walletSchema);

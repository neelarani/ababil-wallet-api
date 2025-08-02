import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Wallet } from './wallet.model';

export const isWalletBlocked = async (walletId: Types.ObjectId) =>
  (await Wallet.findOne({ _id: walletId }))?.isBlocked ? true : false;

export const blockWallet = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  let wallet = await Wallet.exists({ _id: user.wallet });

  if (!wallet) throw new Error('Wallet not found');

  if (await isWalletBlocked(wallet._id))
    throw new Error('Wallet is already blocked');

  wallet = await Wallet.findByIdAndUpdate(
    wallet._id,
    { isBlocked: true },
    { new: true }
  );

  if (!wallet) throw new Error('Wallet not found');

  return wallet;
};

export const unblockWallet = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  let wallet = await Wallet.exists({ _id: user.wallet });

  if (!wallet) throw new Error('Wallet not found');

  if (!(await isWalletBlocked(wallet._id)))
    throw new Error('Wallet is already unblocked');

  wallet = await Wallet.findByIdAndUpdate(
    wallet._id,
    { isBlocked: false },
    { new: true }
  );

  if (!wallet) throw new Error('Wallet not found');

  return wallet;
};

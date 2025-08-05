import { model, Schema } from 'mongoose';
import {
  IAuthProvider,
  IsActive,
  IToAgent,
  IToAgentStatus,
  IUser,
  Role,
} from './user.interface';
import { Collections } from '@/interface';

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    isDeleted: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: {
      type: [authProviderSchema],
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: Collections.Wallet,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const toAgentSchema = new Schema<IToAgent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: Collections.User,
  },
  status: {
    type: String,
    enum: Object.values(IToAgentStatus),
    default: IToAgentStatus.PENDING,
  },
});

export const User = model<IUser>(Collections.User, userSchema);
export const ToAgent = model<IToAgent>(Collections.ToAgent, toAgentSchema);

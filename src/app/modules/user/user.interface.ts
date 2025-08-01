import { ObjectId, Schema } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT',
}

export interface IAuthProvider {
  provider: 'google' | 'credentials';
  providerId: string;
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface IUser {
  _id?: ObjectId | string;
  name: string;
  email: string;
  password: string;
  phone: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: Array<IAuthProvider>;
  wallet: Schema.Types.ObjectId;
  transaction: Schema.Types.ObjectId;
}

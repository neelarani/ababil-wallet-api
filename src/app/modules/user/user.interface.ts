import { ObjectId, Schema } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT',
}

export interface IAuthProvider {
  provider: 'credentials' | 'google';
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
  picture?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: Array<IAuthProvider>;
  wallet: Schema.Types.ObjectId;
}

export enum IToAgentStatus {
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  APPROVED = 'APPROVED',
}
export interface IToAgent {
  user: ObjectId | string;
  status: IToAgentStatus;
}

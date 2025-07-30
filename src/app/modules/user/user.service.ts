import bcryptjs from 'bcryptjs';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import { AppError } from '@/app/errors';
import { ENV } from '@/config';
import { JwtPayload } from 'jsonwebtoken';
import { HTTP_CODE } from '@/shared';

export const createUser = async (Payload: IUser) => {
  const { email, password, ...rest } = Payload;

  if (await User.exists({ email }))
    throw new AppError(400, 'User already exist!');

  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: email,
  };

  const hashPassword = bcryptjs.hashSync(
    password,
    bcryptjs.genSaltSync(ENV.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    ...rest,
    auths: [authProvider],
    password: hashPassword,
  });

  return user;
};

export const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (userId !== decodedToken.userId)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'You are not authorized!');

  if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'You are not authorized!');

  const isUserExist = await User.findById(userId);

  if (!isUserExist) throw new AppError(HTTP_CODE.NOT_FOUND, 'User Not Found');

  if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN)
    throw new AppError(HTTP_CODE.UNAUTHORIZED, 'You are not authorized!');

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(HTTP_CODE.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    throw new AppError(HTTP_CODE.FORBIDDEN, 'You are not authorized');
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runvalidator: true,
  });
  return newUpdateUser;
};

export const getAllUsers = async () => {
  const user = await User.find();
  return user;
};

export const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

import { IUser } from '@/app/modules/user/user.interface';
import { ENV } from '@/config';
import { generateToken } from './jwt';

export const createUserTokens = (user: Partial<IUser>) => {
  const JwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    JwtPayload,
    ENV.JWT_ACCESS_SECRET,
    ENV.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    JwtPayload,
    ENV.JWT_REFRESH_SECRET,
    ENV.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

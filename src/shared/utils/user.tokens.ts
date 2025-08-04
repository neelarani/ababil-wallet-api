import { IsActive, IUser } from '@/app/modules/user/user.interface';
import { User } from '@/app/modules/user/user.model';
import { ENV } from '@/config';
import { JwtPayload } from 'jsonwebtoken';
import { generateToken, HTTP_CODE, verifyToken } from '@/shared';
import { AppError } from '@/app/errors';

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    ENV.JWT_ACCESS_SECRET,
    ENV.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    ENV.JWT_REFRESH_SECRET,
    ENV.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefresh = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    ENV.JWT_REFRESH_SECRET
  ) as JwtPayload;

  let user = await User.findOne({ email: verifiedRefreshToken.email });

  if (!user) throw new AppError(404, 'User not exist to getNewAccessToken');

  if (
    user?.isActive === IsActive.BLOCKED ||
    user?.isActive === IsActive.INACTIVE
  )
    throw new AppError(HTTP_CODE.BAD_REQUEST, `User is: ${user.isActive}`);

  if (user?.isDeleted === true)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'User is deleted!');

  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, ENV.JWT_ACCESS_SECRET, '1d');

  return accessToken;
};

import { AppError } from '@/app/errors';
import { catchAsync, HTTP_CODE } from '@/shared';
import { ENV } from '@/config';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { IsActive } from '../modules/user/user.interface';
import { verifyToken } from '@/shared/utils/jwt';

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req, res, next) => {
    const accessToken = req.headers.authorization || req.headers.authorization;

    if (!accessToken) throw new AppError(403, 'No Token Received!');

    const verifiedToken = verifyToken(
      accessToken,
      ENV.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const user = await User.findOne({ email: verifiedToken.email });

    if (!user) throw new AppError(HTTP_CODE.BAD_REQUEST, 'User does not Exist');

    if (!user.isVerified)
      throw new AppError(HTTP_CODE.BAD_REQUEST, 'User is not verified!');

    if (
      user.isActive === IsActive.BLOCKED ||
      user.isActive === IsActive.INACTIVE
    )
      throw new AppError(HTTP_CODE.BAD_REQUEST, `User is ${user.isActive}`);

    if (user.isDeleted)
      throw new AppError(HTTP_CODE.BAD_REQUEST, 'User is deleted');

    if (!authRoles.includes(verifiedToken.role))
      throw new AppError(403, 'You are not permitted to view this route');

    req.user = verifiedToken;
    next();
  });

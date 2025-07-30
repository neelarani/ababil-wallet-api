import { AppError } from '@/app/errors';
import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import passport from 'passport';
import { IUser } from '../user/user.interface';
import { createUserTokens } from '@/shared/utils/user.tokens';
import { setAuthCookie } from '@/shared/utils/-setCookie';

export const credentialLogin = catchAsync(async (req, res, next) => {
  passport.authenticate(
    'local',
    async (err: any, user: Partial<IUser>, info: any) => {
      if (err) return next(new AppError(HTTP_CODE.UNAUTHORIZED, err));

      if (!user)
        return next(new AppError(HTTP_CODE.UNAUTHORIZED, info?.message));

      const { password, ...rest } = (user as any).toObject();

      console.log(password);

      const tokens = createUserTokens(user);

      setAuthCookie(res, tokens);

      sendResponse(res, {
        success: true,
        status: HTTP_CODE.CREATED,
        message: 'User logged successfully',
        data: { tokens, user: rest },
      });
    }
  )(req, res, next);
});

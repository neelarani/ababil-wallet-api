import { AppError } from '@/app/errors';
import { createNewAccessTokenWithRefresh, HTTP_CODE, sendMail } from '@/shared';
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ENV } from '@/config';
import { IAuthProvider, IsActive } from '../user/user.interface';

export const getVerifyUserSecret = async (email: string) => {
  let user = await User.findOne({ email });

  if (!user) throw new AppError(HTTP_CODE.NOT_FOUND, 'User not found!');

  if (user.isVerified)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'User already verified!');

  const secret = jwt.sign({ id: user._id }, ENV.USER_VERIFY_SECRET, {
    expiresIn: '5m',
  });

  const info = await sendMail({
    to: user.email,
    subject: 'Verify your account',
    template: {
      name: 'verify-user',
      data: {
        secretURL: `${ENV.BACKEND_BASE_URL}/api/v1/auth/verify?secret=${secret}`,
        username: user.name,
      },
    },
  });

  if (!info.accepted.includes(user.email))
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to send verify email!`
    );
};

export const verifyUser = async (secret: string) => {
  try {
    const { id } = jwt.verify(secret, ENV.USER_VERIFY_SECRET) as {
      id: string;
      email: string;
    };

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    return user;
  } catch (error) {
    return null;
  }
};

export const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefresh(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const resetPassword = async (
  payload: { newPassword: string; id: string },
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, 'You can not reset your password');
  }

  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(401, 'User does not exist');
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(ENV.BCRYPT_SALT_ROUND)
  );

  user.password = hashedPassword;

  await user.save();
};

export const forgotPassword = async (email: string) => {
  if (!email) throw new AppError(HTTP_CODE.BAD_GATEWAY, `Email is required`);

  const user = await User.findOne({ email });

  if (!user) throw new AppError(HTTP_CODE.BAD_REQUEST, 'User does not exist');

  if (!user.isVerified)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'User is not verified');

  if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)
    throw new AppError(HTTP_CODE.BAD_REQUEST, `User is ${user.isActive}`);

  if (user.isDeleted)
    throw new AppError(HTTP_CODE.BAD_REQUEST, 'User is deleted');

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(jwtPayload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: '10m',
  });

  const info = await sendMail({
    to: user.email,
    subject: 'Password Reset',
    template: {
      name: 'forgetPassword',
      data: {
        name: user.name,
        resetUILink: `${ENV.FRONTEND_BASE_URL}/reset-password?id=${user._id}&token=${resetToken}`,
      },
    },
  });

  if (!info.accepted.includes(user.email))
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to send reset email Link`
    );
};

export const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(404, 'User not found');

  if (
    user.password &&
    user.auths.some(providerObject => providerObject.provider === 'google')
  )
    throw new AppError(
      HTTP_CODE.BAD_REQUEST,
      'You have already set you password. Now you can change the password from your profile password update'
    );

  const hashedPassword = bcryptjs.hashSync(
    plainPassword,
    bcryptjs.genSaltSync(ENV.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: user.email,
  };

  const auths: Array<IAuthProvider> = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = bcryptjs.compareSync(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch)
    throw new AppError(HTTP_CODE.UNAUTHORIZED, 'Old Password does not match');

  user!.password = bcryptjs.hashSync(
    newPassword,
    bcryptjs.genSaltSync(ENV.BCRYPT_SALT_ROUND)
  );

  user!.save();
};

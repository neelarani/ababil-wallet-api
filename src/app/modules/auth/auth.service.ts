import { AppError } from '@/app/errors';
import { HTTP_CODE } from '@/shared';
import { User } from '../user/user.model';
import jwt from 'jsonwebtoken';
import { ENV } from '@/config';
import { sendMail } from '@/shared/utils/_sendMail';

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

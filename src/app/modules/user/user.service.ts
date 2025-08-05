import { AppError } from '@/app/errors';
import { IAuthProvider, IToAgentStatus, IUser, Role } from './user.interface';
import { ToAgent, User } from './user.model';
import bcryptjs from 'bcryptjs';
import { ENV } from '@/config';
import { useQuery } from 'mongoose-qb';
import { Wallet } from '../wallet/wallet.model';
import { JwtPayload } from 'jsonwebtoken';
import { HTTP_CODE, rollback, sendMail } from '@/shared';
import { uploadToCloudinary } from '@/shared/utils/_uploadToCloudinary';

export const registerUser = async (Payload: IUser) => {
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

  let user = await User.create({
    email,
    ...rest,
    auths: [authProvider],
    password: hashPassword,
  });

  const wallet = await Wallet.create({
    balance: ENV.WALLET_INITIAL_BALANCE,
    user: user._id,
  });

  return await User.findByIdAndUpdate(
    user._id,
    { wallet: wallet._id },
    { new: true }
  );
};

export const editProfile = async (
  decodedToken: JwtPayload,
  file?: Express.Multer.File,
  data?: IUser
) => {
  let user = await User.findById(decodedToken.userId);
  if (!user) throw new AppError(HTTP_CODE.NOT_FOUND, `User not found`);

  if (file) {
    const upload = await uploadToCloudinary(file);
    user = await User.findByIdAndUpdate(
      user._id,
      {
        picture: upload.secure_url,
      },
      { new: true, runValidators: true }
    );

    if (!user)
      throw new AppError(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        `Failed to Add Profile Pictrue`
      );
  }

  if (data) {
    const { name } = data || {};
    user = await User.findByIdAndUpdate(
      user._id,
      {
        name,
      },
      { new: true, runValidators: true }
    );

    if (!user)
      throw new AppError(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        `Failed to Rename Profile!`
      );
  }

  const { password, ...rest } = user.toObject();

  return rest;
};

export const getAllUsers = async (query: Record<string, string>) => {
  const users = await useQuery(User, query, {
    fields: true,
    filter: true,
    sort: true,
    paginate: true,
    excludes: ['password', 'auths', 'phone'],
    populate: [{ path: 'wallet', select: 'balance -_id' }],
    search: ['email'],
  });
  return users;
};
export const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new AppError(HTTP_CODE.NOT_FOUND, 'User Not Found!');
  }

  return user;
};

export const requestForAgent = async (decodedToken: JwtPayload) => {
  const { userId, email } = decodedToken;

  const user = await User.findById(userId);

  if (!user) throw new AppError(404, 'User not found!');

  if (user.role !== Role.USER)
    throw new AppError(HTTP_CODE.BAD_REQUEST, `You are already an agent!`);

  let toAgent = await ToAgent.findOne({ user: user._id });

  if (!toAgent) {
    toAgent = await ToAgent.create({
      status: IToAgentStatus.PENDING,
      user: user._id,
    });
  } else {
    toAgent = await ToAgent.findByIdAndUpdate(
      toAgent._id,
      { status: IToAgentStatus.PENDING },
      { new: true }
    );
  }

  if (!toAgent)
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to request for agent.`
    );

  const info = await sendMail({
    subject: 'Request for Agent in Neela Wallet API',
    to: email,
    template: {
      name: 'request-for-agent',
      data: {
        name: user.name,
        status: toAgent.status,
      },
    },
  });

  if (!info.accepted.includes(email))
    throw new AppError(
      HTTP_CODE.INTERNAL_SERVER_ERROR,
      `Failed to send email.`
    );
};

export const updateToAgentStatus = rollback(
  async (session, requestAgentId: string, status: IToAgentStatus) => {
    let toAgent = await ToAgent.findById(requestAgentId).session(session);

    if (!toAgent) throw new AppError(404, 'Agent request was not found!');

    const user = await User.findById(toAgent.user).session(session);

    if (!user)
      throw new AppError(404, 'User not found for this agent request!');

    if (toAgent.status === IToAgentStatus.APPROVED)
      throw new AppError(
        HTTP_CODE.BAD_REQUEST,
        `The agent request is already ${IToAgentStatus.APPROVED}!`
      );

    toAgent = await ToAgent.findByIdAndUpdate(
      requestAgentId,
      { status, user: user._id },
      { new: true, runValidators: true, session }
    ).populate({ path: 'user', select: 'name email phone' });

    if (toAgent!.status === IToAgentStatus.APPROVED) {
      user.role = Role.AGENT;
      await user.save({ session });
    }

    const info = await sendMail({
      subject: 'Request for Agent in Neela Wallet API',
      to: user.email,
      template: {
        name: 'update-to-agent-status',
        data: {
          name: user.name,
          status: toAgent!.status,
        },
      },
    });

    if (!info.accepted.includes(user.email))
      throw new AppError(
        HTTP_CODE.INTERNAL_SERVER_ERROR,
        `Failed to send email.`
      );

    return toAgent;
  }
);

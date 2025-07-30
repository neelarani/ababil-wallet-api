import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import * as service from './user.service';
import { verifyToken } from '@/shared/utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const createUser = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.CREATED,
    message: 'User registration has been completed successfully!',
    data: await service.createUser(req.body),
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const payload = req.body;
  const user = await service.updateUser(
    userId,
    payload,
    verifyToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'User Updated Successfully!',
    data: user,
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  const result = await service.getAllUsers();

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'All Users Retrieved Successfully!',
    data: result,
  });
});

export const getSingleUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await service.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'User Retrieved Successfully!',
    data: result,
  });
});

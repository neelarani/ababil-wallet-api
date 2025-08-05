import { catchAsync, HTTP_CODE, sendResponse } from '@/shared';
import * as service from './user.service';
import { JwtPayload } from 'jsonwebtoken';

export const registerUser = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'User registration has been completed successfully!',
    data: await service.registerUser(req.body),
  });
});

export const editProfile = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'User profile updated successfully!',
    data: await service.editProfile(
      req.user as JwtPayload,
      req.file as Express.Multer.File,
      req.body
    ),
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Retrieve all user successfully!',
    ...(await service.getAllUsers(req.query as Record<string, string>)),
  });
});

export const getSingleUser = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Retrieve user successfully!',
    data: await service.getSingleUser(req.params.id),
  });
});

export const requestForAgent = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Request for agent has been sended successfully!',
    data: await service.requestForAgent(req.user as JwtPayload),
  });
});

export const updateToAgentStatus = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    status: HTTP_CODE.OK,
    message: 'Request for agent has been ' + req.body.status,
    data: await service.updateToAgentStatus(
      req.body.requestAgentId,
      req.body.status
    ),
  });
});

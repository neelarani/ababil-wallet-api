import { Router } from 'express';
import { checkAuth, multerUpload, validateRequest } from '@/app/middlewares';
import * as controller from './user.controller';
import * as validator from './user.validation';
import { Role } from './user.interface';

const router = Router();

router.post(
  '/register',
  validateRequest(validator.zCreateUserSchema),
  controller.registerUser
);

router.patch(
  '/edit',
  checkAuth(...Object.values(Role)),
  multerUpload.single('file'),
  validateRequest(validator.zUpdateUserSchema),
  controller.editProfile
);

router.get(
  '/get-all-users',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  controller.getAllUsers
);
router.get(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  controller.getSingleUser
);

router.get(
  '/request-for-agent',
  checkAuth(Role.USER),
  controller.requestForAgent
);

router.patch(
  '/update-to-agent-status',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(validator.zUpdateToAgentSchema),
  controller.updateToAgentStatus
);

export default router;

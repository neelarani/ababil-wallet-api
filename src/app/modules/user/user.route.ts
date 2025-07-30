import { validateRequest } from '@/app/middlewares';
import { Router } from 'express';
import { zCreateUserSchema, zUpdateUserSchema } from './user.validation';
import * as controller from './user.controller';
import { checkAuth } from '@/app/middlewares/_checkAuth';
import { Role } from './user.interface';

const router = Router();

router.post(
  '/register',
  validateRequest(zCreateUserSchema),
  controller.createUser
);

router.get(
  '/all-user',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  controller.getAllUsers
);

router.get(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  controller.getSingleUser
);

router.patch(
  '/update/:id',
  validateRequest(zUpdateUserSchema),
  checkAuth(...Object.values(Role)),
  controller.updateUser
);

export default router;

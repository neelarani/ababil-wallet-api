import { Router } from 'express';
import * as controller from './wallet.controller';
import { checkAuth } from '@/app/middlewares';
import { Role } from '../user/user.interface';

const router = Router();

router.patch(
  '/block/:userId',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  controller.blockWallet
);

router.patch(
  '/unblock/:userId',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  controller.unblockWallet
);

export default router;

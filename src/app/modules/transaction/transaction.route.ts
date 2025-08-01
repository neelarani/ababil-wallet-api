import { checkAuth, validateRequest } from '@/app/middlewares';
import { Router } from 'express';
import * as validator from './transaction.validation';
import * as controller from './transaction.controller';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/top-up',
  checkAuth(Role.USER),
  validateRequest(validator.zTopUpMoneySchema),
  controller.topUpMoney
);

router.post(
  '/withdraw',
  checkAuth(Role.USER),
  validateRequest(validator.zWithdrawSchema),
  controller.withdraw
);

router.post(
  '/send-money',
  checkAuth(Role.USER),
  validateRequest(validator.zSendMoneySchema),
  controller.sendMoney
);

router.get(
  '/transaction-history',
  checkAuth(...Object.values(Role)),
  controller.transactionHistory
);

export default router;

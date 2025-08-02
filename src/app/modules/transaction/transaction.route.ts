import { checkAuth, validateRequest } from '@/app/middlewares';
import { Router } from 'express';
import * as validator from './transaction.validation';
import * as controller from './transaction.controller';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/top-up',
  checkAuth(Role.USER, Role.AGENT),
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

router.post(
  '/cash-in',
  validateRequest(validator.zCashInSchema),
  checkAuth(Role.AGENT),
  controller.cashIn
);

router.post(
  '/cash-out',
  validateRequest(validator.zCashOutSchema),
  checkAuth(Role.USER),
  controller.cashOut
);

export default router;

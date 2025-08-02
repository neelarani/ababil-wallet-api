import { Router } from 'express';
import * as controller from './auth.controller';
import { validateRequest } from '@/app/middlewares';
import * as validator from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(validator.zCredentialLoginSchema),
  controller.credentialLogin
);
router.post(
  '/get-verify-token',
  validateRequest(validator.zGetVerifyUserSecretSchema),
  controller.getVerifyUserSecret
);

router.get('/verify', controller.verifyUser);

export default router;

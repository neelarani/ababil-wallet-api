import { Router } from 'express';
import * as controller from './auth.controller';
import { checkAuth, validateRequest } from '@/app/middlewares';
import * as validator from './auth.validation';
import passport from 'passport';
import { ENV } from '@/config';
import { Role } from '../user/user.interface';

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

router.post(
  '/set-password',
  checkAuth(...Object.values(Role)),
  controller.setPassword
);

router.post(
  '/change-password',
  checkAuth(...Object.values(Role)),
  validateRequest(validator.zChangePasswordSchema),
  controller.changePassword
);

router.post('/forgot-password', controller.forgotPassword);

router.post(
  '/reset-password',
  checkAuth(...Object.values(Role)),
  validateRequest(validator.zResetPasswordSchema),
  controller.resetPassword
);

router.get('/google', controller.googleLogin);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${ENV.FRONTEND_BASE_URL}/login?error=There was an server side issue!`,
  }),
  controller.googleCallback
);

export default router;

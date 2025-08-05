import { Router } from 'express';
import { checkAuth, validateRequest } from '@/app/middlewares';
import * as controller from './auth.controller';
import * as validator from './auth.validation';
import { Role } from '../user/user.interface';
import { ENV } from '@/config';
import passport from 'passport';

const router = Router();

router.post(
  '/login',
  validateRequest(validator.zCredentialLoginSchema),
  controller.credentialLogin
);

router.get('/access-token', controller.getNewAccessToken);
router.delete('/logout', controller.logout);

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

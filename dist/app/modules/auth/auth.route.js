"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../../app/middlewares");
const controller = __importStar(require("./auth.controller"));
const validator = __importStar(require("./auth.validation"));
const user_interface_1 = require("../user/user.interface");
const config_1 = require("../../../config");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/login', (0, middlewares_1.validateRequest)(validator.zCredentialLoginSchema), controller.credentialLogin);
router.get('/access-token', controller.getNewAccessToken);
router.delete('/logout', controller.logout);
router.post('/get-verify-token', (0, middlewares_1.validateRequest)(validator.zGetVerifyUserSecretSchema), controller.getVerifyUserSecret);
router.get('/verify', controller.verifyUser);
router.post('/set-password', (0, middlewares_1.checkAuth)(...Object.values(user_interface_1.Role)), controller.setPassword);
router.post('/change-password', (0, middlewares_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, middlewares_1.validateRequest)(validator.zChangePasswordSchema), controller.changePassword);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', (0, middlewares_1.validateRequest)(validator.zResetPasswordSchema), controller.resetPassword);
router.get('/google', controller.googleLogin);
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${config_1.ENV.FRONTEND_BASE_URL}/login?error=There was an server side issue!`,
}), controller.googleCallback);
exports.default = router;

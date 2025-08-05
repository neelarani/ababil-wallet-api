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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = exports.googleLogin = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.setPassword = exports.verifyUser = exports.getVerifyUserSecret = exports.logout = exports.getNewAccessToken = exports.credentialLogin = void 0;
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const passport_1 = __importDefault(require("passport"));
const service = __importStar(require("./auth.service"));
const config_1 = require("../../../config");
exports.credentialLogin = (0, shared_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, err));
        if (!user)
            return next(new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, info === null || info === void 0 ? void 0 : info.message));
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        const tokens = (0, shared_1.createUserTokens)(user);
        (0, shared_1.setAuthCookie)(res, tokens);
        (0, shared_1.sendResponse)(res, {
            success: true,
            status: shared_1.HTTP_CODE.CREATED,
            message: 'User logged successfully',
            data: { tokens, user: rest },
        });
    }))(req, res, next);
}));
exports.getNewAccessToken = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenInfo = yield service.getNewAccessToken(req.cookies.refreshToken);
    (0, shared_1.setAuthCookie)(res, tokenInfo);
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.CREATED,
        message: 'New access token successfully generated',
        data: tokenInfo,
    });
}));
exports.logout = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.OK,
        message: 'Logged Out',
    });
}));
exports.getVerifyUserSecret = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.OK,
        message: `User verification link has been sended successfully!`,
        data: yield service.getVerifyUserSecret(req.body.email),
    });
}));
exports.verifyUser = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedUser = yield service.verifyUser(req.query.secret);
    return !verifiedUser
        ? res.redirect(`${config_1.ENV.FRONTEND_BASE_URL}/login`)
        : (() => {
            (0, shared_1.setAuthCookie)(res, (0, shared_1.createUserTokens)(verifiedUser));
            res.redirect(`${config_1.ENV.FRONTEND_BASE_URL}`);
        })();
}));
exports.setPassword = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.CREATED,
        message: 'Password has been reset successfully!',
        data: yield service.setPassword(req.user.userId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.password),
    });
}));
exports.forgotPassword = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.CREATED,
        message: 'Reset Password Email has been sended!',
        data: yield service.forgotPassword((_a = req.body) === null || _a === void 0 ? void 0 : _a.email),
    });
}));
exports.resetPassword = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.CREATED,
        message: 'Password has been reset successfully!',
        data: yield service.resetPassword(req.body.password, req.query.resetToken),
    });
}));
exports.changePassword = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, shared_1.sendResponse)(res, {
        success: true,
        status: shared_1.HTTP_CODE.CREATED,
        message: 'Password has been changed successfully!',
        data: yield service.changePassword(req.body.oldPassword, req.body.newPassword, req.user),
    });
}));
exports.googleLogin = (0, shared_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || '/';
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        state: redirect,
    })(req, res, next);
}));
exports.googleCallback = (0, shared_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, 'User Not Found!');
    const state = (_a = req.query) === null || _a === void 0 ? void 0 : _a.state;
    const tokenInfo = (0, shared_1.createUserTokens)(req.user);
    (0, shared_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${config_1.ENV.FRONTEND_BASE_URL}/${!state.startsWith('/') ? state : ''}`);
}));

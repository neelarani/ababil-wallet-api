"use strict";
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
exports.credentialLogin = void 0;
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const passport_1 = __importDefault(require("passport"));
const user_tokens_1 = require("../../../shared/utils/user.tokens");
const _setCookie_1 = require("../../../shared/utils/-setCookie");
exports.credentialLogin = (0, shared_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, err));
        if (!user)
            return next(new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, info === null || info === void 0 ? void 0 : info.message));
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        console.log(password);
        const tokens = (0, user_tokens_1.createUserTokens)(user);
        (0, _setCookie_1.setAuthCookie)(res, tokens);
        (0, shared_1.sendResponse)(res, {
            success: true,
            status: shared_1.HTTP_CODE.CREATED,
            message: 'User logged successfully',
            data: { tokens, user: rest },
        });
    }))(req, res, next);
}));

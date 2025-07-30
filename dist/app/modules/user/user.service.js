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
exports.getSingleUser = exports.getAllUsers = exports.updateUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const errors_1 = require("../../../app/errors");
const config_1 = require("../../../config");
const shared_1 = require("../../../shared");
const createUser = (Payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = Payload, rest = __rest(Payload, ["email", "password"]);
    if (yield user_model_1.User.exists({ email }))
        throw new errors_1.AppError(400, 'User already exist!');
    const authProvider = {
        provider: 'credentials',
        providerId: email,
    };
    const hashPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(config_1.ENV.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign(Object.assign({ email }, rest), { auths: [authProvider], password: hashPassword }));
    return user;
});
exports.createUser = createUser;
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId !== decodedToken.userId)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'You are not authorized!');
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, 'You are not authorized!');
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist)
        throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, 'User Not Found');
    if (decodedToken.role === user_interface_1.Role.ADMIN && isUserExist.role === user_interface_1.Role.SUPER_ADMIN)
        throw new errors_1.AppError(shared_1.HTTP_CODE.UNAUTHORIZED, 'You are not authorized!');
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.FORBIDDEN, 'You are not authorized');
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        throw new errors_1.AppError(shared_1.HTTP_CODE.FORBIDDEN, 'You are not authorized');
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runvalidator: true,
    });
    return newUpdateUser;
});
exports.updateUser = updateUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find();
    return user;
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    return user;
});
exports.getSingleUser = getSingleUser;

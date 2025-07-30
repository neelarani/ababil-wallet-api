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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const user_interface_1 = require("../../app/modules/user/user.interface");
const user_model_1 = require("../../app/modules/user/user.model");
const config_1 = require("../../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: config_1.ENV.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log(`super admin is already exists!`);
            return;
        }
        console.log('trying to create super admin');
        const hashedPassword = yield bcryptjs_1.default.hash(config_1.ENV.SUPER_ADMIN_PASSWORD, Number(config_1.ENV.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: 'credentials',
            providerId: config_1.ENV.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: 'super admin',
            role: user_interface_1.Role.SUPER_ADMIN,
            email: config_1.ENV.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isverified: true,
            auths: [authProvider],
        };
        const superAdmin = yield user_model_1.User.create(payload);
        console.log('super admin created successfully! \n');
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;

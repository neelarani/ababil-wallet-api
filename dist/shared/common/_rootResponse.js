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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootResponse = void 0;
const constants_1 = require("../constants");
const util_1 = require("../util");
exports.rootResponse = (0, util_1.catchAsync)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, util_1.sendResponse)(res, {
        success: true,
        status: constants_1.HTTP_CODE.OK,
        message: 'Welcome to Ababil Wallet API',
    });
}));
